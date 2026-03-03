const localStrategy = require("passport-local");
const bycryptjs = require("bcryptjs");
const db = require("../db/queries.js");

module.exports.configurePassport = (passport) => {
	passport.use(
		new localStrategy(async (username, password, done) => {
			try {
				const user = await db.fetchUserByUsername(username);

				if (!user) {
					console.log("Login denied");
					return done(null, false, { message: "Incorrect username" });
				}

				const match = await bycryptjs.compare(password, user.password);

				if (!match) {
					console.log("Login denied");
					return done(null, false, { message: "Incorrect password" });
				}

				console.log("login approved");
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}),
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await db.fetchUserById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
};
