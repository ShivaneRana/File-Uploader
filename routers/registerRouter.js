const registerController = require("../controllers/registerController.js");
const { Router } = require("express");

const registerRouter = Router();

registerRouter.get("/", registerController.showRegisterPage);
registerRouter.post("/", registerController.registerUser);

module.exports = registerRouter;
