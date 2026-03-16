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
		const { originalname, filename, mimetype, size } = req.file;

		await db.createNewFile({
			originalname,
			filename,
			mimetype,
			size,
		});
		return res.status(200).redirect("/home");
	},
);

uploadRouter.post(
	"/:targetId",
	isAuth,
	fileUpload.single("input-file"),
	async function (req, res) {
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
	},
);

uploadRouter.post("/create-folder/", isAuth, async (req, res) => {
	const newFolderName = req.body["new-folder-name"];
	const userId = req.user.id;

	await db.createNewFolder({ newFolderName, userId });
	return res.status(200).redirect("/home");
});

uploadRouter.post("/create-folder/:targetId", isAuth, async (req, res) => {
	console.log("uploadRouter targetId");
	let { targetId } = req.params;
	let parentId = Number(targetId);
	const newFolderName = req.body["new-folder-name"];
	const userId = req.user.id;

	await db.createNewFolder({ newFolderName, userId, parentId });
	return res.status(200).redirect(`/home/${parentId}`);
});

module.exports = uploadRouter;
