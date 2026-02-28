const { Router } = require("express");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
	res.status(200).render("index");
});

module.exports = indexRouter;
