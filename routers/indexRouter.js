const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");

const indexRouter = Router();

indexRouter.get("/", isAuth, (req, res) => {
	return res.status(200).render("index");
});

indexRouter.post("/upload",isAuth,(req,res) => {
	console.log("upload route hit!!!!!!");
	return res.status(200).redirect("/");
})

module.exports = indexRouter;
