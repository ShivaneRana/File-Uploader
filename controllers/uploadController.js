const db = require("../db/queries.js");

exports.createFileAtHome = async (req, res) => {
	const { originalname, filename, mimetype, size } = req.file;

	await db.createNewFile({
		originalname,
		filename,
		mimetype,
		size,
	});
	return res.status(200).redirect("/home");
};

exports.createFileAtSpecificFolder = async (req, res) => {
	const { originalname, filename, mimetype, size } = req.file;
	const { targetId } = req.params;
	const folderId = Number(targetId);

	await db.createNewFile({
		originalname,
		filename,
		mimetype,
		size,
		folderId,
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

	// delete files first inside folder then folder itself
	await db.deleteFilesByFolderId({ folderId: folderId });
	await db.deleteFolder({ id: folderId });

	return res.status(200).json({success: true});
};