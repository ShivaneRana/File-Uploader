const { Router } = require("express");
const { isAuth } = require("../middlewares/isAuth.js");
const indexController = require("../controllers/indexController.js");

const indexRouter = Router();

indexRouter.get("/", isAuth, indexController.redirectToHomePage);
indexRouter.get("/home", isAuth, indexController.renderHomePage);
indexRouter.get("/home/:folderId", isAuth, indexController.renderSpecificPage);

module.exports = indexRouter;
