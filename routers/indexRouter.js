const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const db = require("../db/queries.js");
const getMonth = require("../public/js/getMonths.js");
const getSize = require("../public/js/getSize.js");

const indexRouter = Router();

indexRouter.get("/", isAuth, (req, res) => {
	return res.status(200).redirect("/home");
});

indexRouter.get("/home", isAuth, async (req, res) => {
	const userId = Number(req.user.id);
	const folderList = await db.fetchAllFolders({ id: userId });
	return res.status(200).render("index", {
		folderList,
	});
});

indexRouter.get("/home/:folderId", isAuth, async (req, res) => {
	let { folderId } = req.params;
	folderId = Number(folderId);
	let files = await db.fetchFilesByFolderId({ folderId });

	// this is for formatting data for better readability
	files = files.map((file) => {
		return {
			...file,
			size_in_bytes: getSize(file.size_in_bytes),
			createdAt: `${getMonth(file.createdAt.getMonth())} ${file.createdAt.getDate()}, ${file.createdAt.getFullYear()}`,
		};
	});

	const userId = Number(req.user.id);
	const folderList = await db.fetchAllFolders({ id: userId });

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
