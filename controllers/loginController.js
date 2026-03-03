const { body, validationResult, matchedData } = require("express-validator");
const passport = require("passport");

module.exports.showLoginPage = (req, res) => {
	res.status(200).render("login");
};

module.exports.loginUser = async (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/login",
	})(req, res, next);
};
