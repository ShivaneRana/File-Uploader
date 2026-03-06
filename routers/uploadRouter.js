const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" +  file.originalname );
	},
});

const upload = multer({storage: storage});

const uploadRouter = Router();

uploadRouter.post("/", isAuth, upload.single("input-file"), function (req, res) {
		return res.status(200).redirect("/home");
	},
);

module.exports = uploadRouter;
