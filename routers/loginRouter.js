const { Router } = require("express");
const loginController = require("../controllers/loginController.js");

const loginRouter = Router();

loginRouter.get("/", loginController.showLoginPage);
loginRouter.post("/", loginController.loginUser);

module.exports = loginRouter;
