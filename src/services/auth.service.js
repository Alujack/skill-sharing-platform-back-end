const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

const loginWithEmailAndPassword = async (email, password) => {
  console.log("this is email and password",email,password)
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("this is user",user)

  if (!user) {
    throw new Error('Incorrect email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log("this is password match",isPasswordMatch)
  if (!isPasswordMatch) {
    throw new Error('Incorrect email or password');
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
};

const getMe = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

module.exports = { loginWithEmailAndPassword, getMe };