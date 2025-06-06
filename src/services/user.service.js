const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/apiError');

const createUser = async (userData) => {
  if (await prisma.user.findUnique({ where: { email: userData.email } })) {
    throw new ApiError(400, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

const getUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

module.exports = { createUser, getUserById };