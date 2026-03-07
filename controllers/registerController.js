const { matchedData, validationResult, body } = require("express-validator");
const db = require("../db/queries.js");

module.exports.showRegisterPage = (req, res) => {
	res.status(200).render("register");
};

module.exports.registerUser = async (req, res) => {
	const { username, password, email } = req.body;
	await db.createNewUser({ username, password, email });
	res.status(200).redirect("/");
};
