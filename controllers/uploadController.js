const db = require("../db/queries.js");

exports.createFileAtHome = async (req, res) => {
	const { originalname, filename, mimetype, size } = req.file;
	const userId = req.user.id;

	await db.createNewFile({
		originalname,
		filename,
		mimetype,
		size,
		userId
	});
	return res.status(200).redirect("/home");
};

exports.createFileAtSpecificFolder = async (req, res) => {
	const { originalname, filename, mimetype, size } = req.file;
	const { targetId } = req.params;
	const folderId = Number(targetId);
	const userId = req.user.id;

	await db.createNewFile({
		originalname,
		filename,
		mimetype,
		size,
		folderId,
		userId
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
	await db.deleteFilesByFolderId({ folderId: folderId ,userId});
	await db.deleteFolderByFolderId({ id: folderId ,userId});

	return res.status(200).json({ success: true });
};

exports.renameFolder = async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	const userId = req.user.id;

	const newName = req.body["new-folder-name"];

	await db.renameFolderById({
		folderId,
		newName,
		userId
	});

	return res.status(200).redirect(`/home/${folderId}`);
};

exports.deleteFile = async (req, res) => {
	let { fileId } = req.params;
	fileId = Number(fileId);
	const userId = req.user.id;
	const result = await db.deleteFileById({ fileId ,userId});

	return res.status(200).json({
		success: true,
		...result,
	});
};
