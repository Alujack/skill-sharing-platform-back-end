const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const { sendResponse } = require('../utils/apiResponse');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// src/middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Fallback to 500 if undefined
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};


module.exports = { errorConverter, errorHandler };