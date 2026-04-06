const { body, validationResult, matchedData } = require("express-validator");
const passport = require("passport");

const maxCharacters = 64;
const minCharacters = 3;

const validationObject = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Username cannot be empty")
		.bail()
		.isLength({ min: minCharacters, max: maxCharacters })
		.withMessage(
			`Username should be between ${minCharacters} and ${maxCharacters} characters`,
		)
		.bail()
		.matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
		.withMessage(
			"Username can contain only letters, numbers, and special characters",
		)
		.bail(),

	body("password")
		.trim()
		.notEmpty()
		.withMessage("Password cannot be empty")
		.bail()
		.isLength({ min: minCharacters, max: maxCharacters })
		.withMessage(
			`Password should be between ${minCharacters} and ${maxCharacters} characters`,
		)
		.bail()
		.matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
		.withMessage(
			"Password can contain only letters, numbers, and special characters",
		)
		.bail(),
];

module.exports.showLoginPage = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/home");
	}

	return res.status(200).render("login");
};

module.exports.loginUser = [
	validationObject,
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(200).render("login", { errors: errors.array() });
		}

		passport.authenticate("local", {
			successRedirect: "/home",
			failureRedirect: "/login",
			failureFlash: true,
		})(req, res, next);
	},
];
