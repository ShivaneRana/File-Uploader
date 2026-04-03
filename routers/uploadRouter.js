const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const multer = require("multer");
const uploadController = require("../controllers/uploadController.js");

const fileUpload = multer({
  		storage: multer.memoryStorage(),
  		limits: { fileSize: 50 * 1024 * 1024 } // 50mb
});

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

uploadRouter.delete(
	"/delete-folder/:folderId",
	isAuth,
	uploadController.deleteFolder,
);

uploadRouter.post(
	"/rename-folder/:folderId",
	isAuth,
	uploadController.renameFolder,
);

uploadRouter.delete(
	"/delete-file/:fileId",
	isAuth,
	uploadController.deleteFile,
);

uploadRouter.get(
	"/download-file/:fileId",
	isAuth,
	uploadController.downloadFile,
);

module.exports = uploadRouter;
