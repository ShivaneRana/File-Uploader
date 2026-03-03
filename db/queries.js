const prisma = require("../lib/prisma.js");

module.exports.fetchUserByUsername = async (username) => {
    const result = await prisma.users.findUnique({
        where: {
            username: username
        }
    })

    return result;
}

module.exports.fetchUserById = async (id) => {
    const result = await prisma.users.findUnique({
        where: {
            id: id
        }
    })

    return result;
}