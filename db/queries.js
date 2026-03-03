const prisma = require("../lib/prisma.js");
const bycryptjs = require("bcryptjs");

module.exports.fetchUserByUsername = async (username) => {
	let result;
	try {
		result = await prisma.users.findUnique({
			where: {
				username: username,
			},
		});
	} catch (err) {
		console.error(err);
	}
	return result;
};

module.exports.fetchUserById = async (id) => {
	let result;
	try {
		result = await prisma.users.findUnique({
			where: {
				id: id,
			},
		});
	} catch (err) {
		console.error(err);
	}

	return result;
};

module.exports.createNewUser = async ({ username, password, email }) => {
	let result;
	let hashedPassword = await bycryptjs.hash(password, 10);
	try {
		result = await prisma.users.create({
			data: {
				username: username,
				password: hashedPassword,
				email: email,
			},
		});
	} catch (err) {
		console.error(err);
	}
};
