const { matchedData, validationResult, body } = require("express-validator");
const db = require("../db/queries.js");

const minCharacters = 3;
const maxCharacters = 64;

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
		.bail()
		.custom(async (value) => {
			const result = await db.checkIfUsernameExists({ username: value });

			if (result) {
				throw new Error("username already exists");
			}

			return true;
		}),

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

	body("confirm_password")
		.trim()
		.notEmpty()
		.withMessage("Confirm password cannot be empty")
		.bail()
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true;
		}),

	body("email")
		.trim()
		.optional({ checkFalsy: true })
		.isEmail()
		.withMessage("Incorrect email")
		.bail()
		.isLength({ max: 254 })
		.withMessage("email can only contain 254 character max")
		.bail(),
];

module.exports.showRegisterPage = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/home");
	}

	res.status(200).render("register");
};

module.exports.registerUser = [
	validationObject,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res
				.status(200)
				.render("register", { errors: errors.array() });
		}

		const data = matchedData(req);
		const { username, password, email } = data;
		await db.createNewUser({ username, password, email: email || null });

		return res.redirect("/");
	},
];
