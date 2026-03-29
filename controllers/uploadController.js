const db = require("../db/queries.js");
const supabase = require("../config/supabase.js");

exports.createFileAtHome = async (req, res) => {
	// const { originalname, filename, mimetype, size } = req.file;
	const { originalname, mimetype, size , buffer} = req.file;
	const userId = req.user.id;

	fileName = `${userId}/${Date.now()}-${originalname}`;

	const { data, error } = await supabase.storage
    .from("uploaded_files")
    .upload(fileName, buffer, {
      contentType: mimetype,
    });

  	if (error) return res.status(500).json({ error: error.message });

	await db.createNewFile({
		originalname,
		filename : data.path,
		mimetype,
		size,
		userId,
	});
	return res.status(200).redirect("/home");
};

exports.createFileAtSpecificFolder = async (req, res) => {
	const { originalname, mimetype, size , buffer} = req.file;
	const { targetId } = req.params;
	const folderId = Number(targetId);
	const userId = req.user.id;

	fileName = `${userId}/${Date.now()}-${originalname}`;

	const { data, error } = await supabase.storage
    .from("uploaded_files")
    .upload(fileName, buffer, {
      contentType: mimetype,
    });

  	if (error) return res.status(500).json({ error: error.message });

	await db.createNewFile({
		originalname,
		filename : data.path,
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

	return res.status(200).json({
		success: true,
		...result,
	});
};

exports.downloadFile = async (req,res) => {
	let {fileId} = req.params;
	fileId = Number(fileId)
	const userId = req.user.id;

	const result = await db.fetchFileByFileId({fileId,userId});

	const { data: blob, error } = await supabase.storage
  	.from('uploaded_files')
	.download(result.newfilename);

	const buffer = Buffer.from(await blob.arrayBuffer());
	res.setHeader('Content-Disposition', `attachment; filename="${result.name}"`);
	res.setHeader('Content-Type', result.type);
	res.send(buffer);
}