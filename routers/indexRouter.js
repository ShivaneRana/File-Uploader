const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const db = require("../db/queries.js");

const indexRouter = Router();

indexRouter.get("/", isAuth, (req, res) => {
	return res.status(200).redirect("/home");
});

indexRouter.get("/home", isAuth, async (req, res) => {
	const userId = Number(req.user.id);
	const folderList = await db.fetchAllFoldersByUserId({ id: userId });

	// files and folder present inside home directory have null folderId and parentId
	let files = await db.fetchFilesByFolderId({ folderId: undefined});
	let childFolders = await db.fetchAllFolderByParentId({ userId,parentId: undefined})

	return res.status(200).render("index", {
		currentFolderId: undefined,
		folderList,
		filesList: files,
		childFolders
	});
});

indexRouter.get("/home/:folderId", isAuth, async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	const userId = Number(req.user.id);
	const folderList = await db.fetchAllFoldersByUserId({ id: userId });
	let files = await db.fetchFilesByFolderId({ folderId });

	return res.status(200).render("index", {
		folderList,
		currentFolderId: folderId,
		filesList: files,
	});
});

indexRouter.get("/home/folder/delete/:folderId", isAuth, async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);

	// delete files first inside folder then folder itself
	await db.deleteFilesByFolderId({ folderId: folderId });
	await db.deleteFolder({ id: folderId });
	return res.status(200).redirect("/home");
});

module.exports = indexRouter;
