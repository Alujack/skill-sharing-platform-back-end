const jwt = require('../utils/jwt');
const ApiError = require('../utils/apiError');
const prisma = require('../prisma');

const auth = () => async (req, res, next) => {
  try {
    console.log("this is a token ==",req.cookies?.token)
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden - Insufficient permissions');
    }
    next();
  };
};

module.exports = { auth, authorizeRoles };