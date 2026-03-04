module.exports.isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	return res.status(401).redirect("/login");
};
