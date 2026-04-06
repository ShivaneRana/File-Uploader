const db = require("../db/queries.js");
const supabase = require("../config/supabase.js");

exports.createFileAtHome = async (req, res) => {
	if(!(req.file)){
		req.flash("toast_msg","No file provided.");
		return res.redirect("/home");
	}

	const { originalname, mimetype, size, buffer } = req.file;
	const userId = req.user.id;

	const fileName = `${userId}/${Date.now()}-${originalname}`;

	const { data, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET_NAME)
		.upload(fileName, buffer, {
			contentType: mimetype,
		});

	if (error) return res.status(500).json({ error: error.message });

	await db.createNewFile({
		originalname,
		filename: data.path,
		mimetype,
		size,
		userId,
	});
	return res.status(200).redirect("/home");
};

exports.createFileAtSpecificFolder = async (req, res) => {
	const { targetId } = req.params;
	const folderId = Number(targetId);

	if(!(req.file)){
		req.flash("toast_msg","No file provided.");
		return res.redirect(`/home/${targetId}`);
	}

	const { originalname, mimetype, size, buffer } = req.file;
	const userId = req.user.id;

	const fileName = `${userId}/${Date.now()}-${originalname}`;

	const { data, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET_NAME)
		.upload(fileName, buffer, {
			contentType: mimetype,
		});

	if (error) return res.status(500).json({ error: error.message });

	await db.createNewFile({
		originalname,
		filename: data.path,
		mimetype,
		size,
		folderId,
		userId,
	});

	return res.status(200).redirect(`/home/${folderId}`);
};

exports.createFolderAtHome = async (req, res) => {
	const newFolderName = req.body["new-folder-name"];
	const userId = req.user.id;
	await db.createNewFolder({ newFolderName, userId });
	return res.status(200).redirect("/home");
};

exports.createFolderAtSpecificFolder = async (req, res) => {
	let { targetId } = req.params;
	let parentId = Number(targetId);
	const newFolderName = req.body["new-folder-name"];
	const userId = req.user.id;

	await db.createNewFolder({ newFolderName, userId, parentId });
	return res.status(200).redirect(`/home/${parentId}`);
};

exports.deleteFolder = async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	const userId = req.user.id;

	// delete files first inside folder then folder itself
	await db.deleteFilesByFolderId({ folderId: folderId, userId });
	const result = await db.deleteFolderByFolderId({ id: folderId, userId });

	return res.status(200).json({ success: true, ...result });
};

exports.renameFolder = async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	const userId = req.user.id;

	const newName = req.body["new-folder-name"];

	await db.renameFolderById({
		folderId,
		newName,
		userId,
	});

	return res.status(200).redirect(`/home/${folderId}`);
};

exports.deleteFile = async (req, res) => {
	let { fileId } = req.params;
	fileId = Number(fileId);
	const userId = req.user.id;
	const result = await db.deleteFileById({ fileId, userId });

	const { data, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET_NAME)
		.remove([result.newfilename]);

	if (error) return res.status(500).json({ error: error.message });

	return res.status(200).json({
		success: true,
		...result,
	});
};

exports.downloadFile = async (req, res) => {
	let { fileId } = req.params;
	fileId = Number(fileId);
	const userId = req.user.id;

	const result = await db.fetchFileByFileId({ fileId, userId });

	const { data: blob, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET_NAME)
		.download(result.newfilename);

	if (error) return res.status(500).json({ error: error.message });

	const buffer = Buffer.from(await blob.arrayBuffer());
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${result.name}"`,
	);
	res.setHeader("Content-Type", result.type);
	res.send(buffer);
};
