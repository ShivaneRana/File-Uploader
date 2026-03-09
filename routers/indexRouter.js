const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const db = require("../db/queries.js");

const indexRouter = Router();

indexRouter.get("/", isAuth, (req, res) => {
	return res.status(200).redirect("/home");
});

indexRouter.get("/home", isAuth, async(req, res) => {
	const userId = Number(req.user.id)
	const folderList = await db.fetchAllFolders({id: userId});
	return res.status(200).render("index",{
		folderList
	});
});

module.exports = indexRouter;
