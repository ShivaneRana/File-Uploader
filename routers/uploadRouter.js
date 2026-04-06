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
	(req,res,next) => {
		fileUpload.single("input-file")(req,res,(err) => {
			if(err){
				if(err.code === "LIMIT_FILE_SIZE"){
					req.flash("toast_msg","File exceeds size limit.");
					return res.redirect("/home");
				}
				// this should be an error message.... honestly
				next(err);
			}
			next();
		});
	},
	uploadController.createFileAtHome,
);

uploadRouter.post(
	"/create-file/:targetId",
	isAuth,
	(req,res,next) => {
		fileUpload.single("input-file")(req,res,(err) => {
			let {targetId} = req.params;

			if(err){
				if(err.code === "LIMIT_FILE_SIZE"){
					req.flash("toast_msg","File exceeds size limit.");
					return res.redirect(`/home/${targetId}`);
				}

				// this should be an error message.... honestly
				next(err);
			}
			next();
		});
	},
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
