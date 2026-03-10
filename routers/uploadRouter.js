const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const multer = require("multer");
const db = require("../db/queries.js");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});

const fileUpload = multer({ storage: storage });

const uploadRouter = Router();

uploadRouter.post(
	"/",
	isAuth,
	fileUpload.single("input-file"),
	async function (req, res) {
		const {originalname,filename,mimetype,size} = req.file;

		// just for dev environment
		const fid = 27;
		await db.createNewFile({originalname,filename,mimetype,size,folderId:fid})
		return res.status(200).redirect("/home");
	},
);

uploadRouter.post("/create-folder", isAuth, async (req, res) => {
	const newFolderName = req.body["new-folder-name"];
	const userId = req.user.id;
	db.createNewFolder({ newFolderName, userId });
	return res.status(200).redirect("/home");
});

module.exports = uploadRouter;
