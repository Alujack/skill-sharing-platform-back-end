const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/jwt');

const loginWithEmailAndPassword = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error('Incorrect email or password');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
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
  console.log("getMe == ",userId)
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

module.exports = { loginWithEmailAndPassword, getMe };