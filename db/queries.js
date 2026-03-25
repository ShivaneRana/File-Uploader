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

module.exports.deleteFolder = async ({ id }) => {
	await prisma.folder.delete({
		where: {
			id: id,
		},
	});
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
	let result = await prisma.file.findMany({
		where: {
			folderId: folderId ?? null,
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

module.exports.deleteFilesByFolderId = async ({ folderId }) => {
	const result = await prisma.file.deleteMany({
		where: {
			folderId: folderId,
		},
	});

	return result;
};

module.exports.renameFolderById = async ({ folderId, newName }) => {
	await prisma.folder.update({
		where: {
			id: folderId,
		},
		data: {
			name: newName,
		},
	});
};

module.exports.deleteFileById = async ({ fileId }) => {
	const result = await prisma.file.delete({
		where: {
			id: fileId,
		},
	});

	return result;
};
