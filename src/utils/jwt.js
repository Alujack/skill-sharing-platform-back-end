const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('./apiError');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

module.exports = { generateToken, verifyToken };