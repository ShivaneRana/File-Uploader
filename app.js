const express = require("express");
const expressSession = require("express-session");
const dotenv = require("dotenv").config({ quiet: true, debug: false });
const path = require("node:path");
const prisma = require("./lib/prisma.js");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { configurePassport } = require("./middlewares/passport.js");
const passport = require("passport");

// Routers
const indexRouter = require("./routers/indexRouter.js");
const loginRouter = require("./routers/loginRouter.js");
const registerRouter = require("./routers/registerRouter.js");
const uploadRouter = require("./routers/uploadRouter.js");

const SESSION_SECRET = process.env.SESSION_SECRET;

const sessionStore = new PrismaSessionStore(prisma, {
	checkPeriod: 24 * 60 * 60 * 1000, //ms
	dbRecordIdIsSessionId: true,
	dbRecordIdFunction: undefined,
});

const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

configurePassport(passport);

app.use(
	expressSession({
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // ms
		},
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore,
	}),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/upload", uploadRouter);

app.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);

		req.session.destroy((err) => {
			if (err) return next(err);

			res.clearCookie("connect.sid");
			return res.redirect("/");
		});
	});
});

app.use((req, res) => {
	return res.status(404).render("404");
});

app.use((err, req, res, next) => {
	console.error(err);
	return res.status(500).render("error");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
	if (err) {
		console.error(err);
	}

	console.log(`http://localhost:${PORT}`);
});
