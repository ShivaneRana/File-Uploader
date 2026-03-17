const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const multer = require("multer");
const uploadController = require("../controllers/uploadController.js");

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
	"/create-file",
	isAuth,
	fileUpload.single("input-file"),
	uploadController.createFileAtHome,
);

uploadRouter.post(
	"/create-file/:targetId",
	isAuth,
	fileUpload.single("input-file"),
	uploadController.createFileAtSpecificFolder,
);

uploadRouter.post(
	"/create-folder",
	isAuth,
	uploadController.createFolderAtHome,
);
uploadRouter.post(
	"/create-folder/:targetId",
	isAuth,
	uploadController.createFolderAtSpecificFolder,
);

module.exports = uploadRouter;
