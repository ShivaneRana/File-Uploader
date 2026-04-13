const prisma = require("../lib/prisma.js");
const bycryptjs = require("bcryptjs");
const getMonth = require("../public/js/getMonths.js");
const getSize = require("../public/js/getSize.js");

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

module.exports.createNewFolder = async ({
	newFolderName,
	userId,
	parentId,
}) => {
	const result = await prisma.folder.create({
		data: {
			name: newFolderName,
			userId: userId,
			parentId: parentId,
		},
	});
};

module.exports.deleteFolderByFolderId = async ({ id, userId }) => {
	const result = await prisma.folder.delete({
		where: {
			id: id,
			userId,
		},
	});

	return result;
};

module.exports.fetchAllFoldersByUserId = async ({ id }) => {
	const result = await prisma.folder.findMany({
		where: {
			userId: id,
		},
		orderBy: {
			name: "asc",
		},
	});

	return result;
};

module.exports.fetchAllFolderByParentId = async ({ userId, parentId }) => {
	let result = await prisma.folder.findMany({
		where: {
			AND: [{ parentId: parentId ?? null }, { userId: userId }],
		},
		orderBy: {
			name: "asc",
		},
	});

	result = result.map((folder) => {
		return {
			...folder,
			createdAt: `${getMonth(folder.createdAt.getMonth())} ${folder.createdAt.getDate()}, ${folder.createdAt.getFullYear()}`,
		};
	});

	return result;
};

module.exports.createNewFile = async ({
	originalname,
	filename,
	mimetype,
	size,
	folderId,
	userId,
}) => {
	const result = await prisma.file.create({
		data: {
			name: originalname,
			newfilename: filename,
			type: mimetype,
			size_in_bytes: size,
			folderId: folderId,
			userId,
		},
	});

	return result;
};

module.exports.fetchFilesByFolderId = async ({ folderId, userId }) => {
	let result = await prisma.file.findMany({
		where: {
			folderId: folderId ?? null,
			userId,
		},
	});

	result = result.map((file) => {
		return {
			...file,
			size_in_bytes: getSize(file.size_in_bytes),
			createdAt: `${getMonth(file.createdAt.getMonth())} ${file.createdAt.getDate()}, ${file.createdAt.getFullYear()}`,
		};
	});

	return result;
};

module.exports.deleteFilesByFolderId = async ({ folderId, userId }) => {
	const result = await prisma.file.deleteMany({
		where: {
			folderId: folderId,
			userId,
		},
	});

	return result;
};

module.exports.renameFolderById = async ({ folderId, newName, userId }) => {
	await prisma.folder.update({
		where: {
			id: folderId,
			userId,
		},
		data: {
			name: newName,
		},
	});
};

module.exports.deleteFileById = async ({ fileId, userId }) => {
	const result = await prisma.file.delete({
		where: {
			id: fileId,
			userId,
		},
	});

	return result;
};

// this is for creating path to home directory.
module.exports.fetchFolderInfoMinimal = async ({ userId, folderId }) => {
	const result = await prisma.folder.findUnique({
		where: {
			id: folderId,
			userId,
		},
		select: {
			id: true,
			name: true,
			parentId: true,
		},
	});
	return result;
};

module.exports.fetchFolderPath = async ({ folderId, userId }) => {
	const path = [];

	let currentFolderId = folderId;

	// fetch folder until hitting root directory
	while (currentFolderId !== null) {
		let response = await this.fetchFolderInfoMinimal({
			userId,
			folderId: currentFolderId,
		});
		path.unshift(response);
		currentFolderId = response.parentId;
	}

	return path;
};

module.exports.checkIfFolderExists = async ({ folderId, userId }) => {
	const result = await prisma.folder.findFirst({
		where: {
			id: folderId,
			userId,
		},
		select: {
			id: true,
		},
	});

	if (result === null) {
		return false;
	} else if (typeof result.id === "number") {
		return true;
	}
};

module.exports.checkIfFileExists = async ({ fileId, userId }) => {
	const result = await prisma.file.findFirst({
		where: {
			id: fileId,
			userId,
		},
		select: {
			id: true,
		},
	});

	if (result === null) {
		return false;
	} else if (typeof result.id === "number") {
		return true;
	}
};

module.exports.fetchFileByFileId = async ({ fileId, userId }) => {
	const result = await prisma.file.findFirst({
		where: {
			id: fileId,
			userId,
		},
	});

	return result;
};

module.exports.checkIfUsernameExists = async ({ username }) => {
	try {
		const result = await prisma.user.findFirst({
			where: { username: username },
		});
		return result ? true : false;
	} catch (err) {
		console.error("DB error in checkIfUsernameExists:", err);
		throw new Error("Database error while checking username");
	}
};
