const prisma = require("../lib/prisma.js");
const bycryptjs = require("bcryptjs");

module.exports.fetchUserByUsername = async (username) => {
	let result;
	try {
		result = await prisma.user.findUnique({
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
		result = await prisma.user.findUnique({
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
		result = await prisma.user.create({
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

module.exports.createNewFolder = async ({ newFolderName, userId }) => {
	const result = await prisma.folder.create({
		data: {
			name: newFolderName,
			userId: userId,
		},
	});
};

module.exports.deleteFolder = async ({ id }) => {
	await prisma.folder.delete({
		where: {
			id: id,
		},
	});
};

module.exports.fetchAllFolders = async ({ id }) => {
	const result = await prisma.folder.findMany({
		where: {
			userId: id,
		},
	});

	return result;
};

module.exports.createNewFile = async ({
	originalname,
	filename,
	mimetype,
	size,
	folderId,
}) => {
	const result = await prisma.file.create({
		data: {
			name: originalname,
			newfilename: filename,
			type: mimetype,
			size_in_bytes: size,
			folderId: folderId,
		},
	});
};

module.exports.fetchFilesByFolderId = async ({ folderId }) => {
	const result = await prisma.file.findMany({
		where: {
			folderId: folderId,
		},
	});

	return result;
};

module.exports.deleteFilesByFolderId = async ({ folderId }) => {
	const result = await prisma.file.deleteMany({
		where: {
			folderId: folderId,
		},
	});

	return result;
};
