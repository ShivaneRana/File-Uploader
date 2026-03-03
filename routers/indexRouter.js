const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
	if(!req.user){
		return res.status(200).redirect("/login");
	}else{
		return res.status(200).redirect("/home");
	}
});

indexRouter.get('/home',(req,res) => {
	return res.status(200).render("index")
})

module.exports = indexRouter;
