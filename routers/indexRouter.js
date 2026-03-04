const { Router } = require("express");
const {isAuth} = require("../middlewares/isAuth.js");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
	if(!req.user){
		return res.status(200).redirect("/login");
	}else{
		return res.status(200).redirect("/home");
	}
});

indexRouter.get('/home',isAuth,(req,res) => {
	return res.status(200).render("index")
})

module.exports = indexRouter;
