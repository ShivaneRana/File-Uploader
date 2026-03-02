const express = require("express");
const expressSession = require("express-session");
const dotenv = require("dotenv").config({ quiet: true, debug: false });
const path = require("node:path");

// Routers
const indexRouter = require("./routers/indexRouter.js");

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", indexRouter);

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
