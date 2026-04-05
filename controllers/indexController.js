const db = require("../db/queries.js");

exports.redirectToHomePage = async (req, res) => {
	return res.status(200).redirect("/home");
};

exports.renderHomePage = async (req, res) => {
	const userId = Number(req.user.id);

	// files and folder present inside home directory have null folderId and parentId
	let files = await db.fetchFilesByFolderId({ folderId: undefined, userId });
	let childFolders = await db.fetchAllFolderByParentId({
		userId,
		parentId: undefined,
	});

	return res.status(200).render("index", {
		currentFolderId: undefined,
		folderList: childFolders,
		filesList: files,
		childFolders,
	});
};

exports.renderSpecificPage = async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	const userId = Number(req.user.id);
	let path = undefined;

	// early fail safe to check if the folder even exists
	const result = await db.checkIfFolderExists({ folderId, userId });
	if (!result) {
		return res.status(404).render("404");
	}

	// const folderList = await db.fetchAllFoldersByUserId({ id: userId });
	let files = await db.fetchFilesByFolderId({ folderId, userId });
	let childFolders = await db.fetchAllFolderByParentId({
		userId,
		parentId: folderId,
	});

	try {
		path = await db.fetchFolderPath({ folderId, userId });
	} catch (err) {
		console.error(err);
		path = [];
	}

	return res.status(200).render("index", {
		folderList: childFolders,
		currentFolderId: folderId,
		filesList: files,
		childFolders,
		filePath: path,
	});
};
