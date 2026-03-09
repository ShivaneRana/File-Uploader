const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const db = require("../db/queries.js");

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

indexRouter.get("/home/folder/delete/:folderId", isAuth , async(req,res) => {
	let {folderId} = req.params;
	folderId = Number(folderId);
	await db.deleteFolder({id: folderId});
	return res.status(200).redirect("/home");
})

module.exports = indexRouter;
