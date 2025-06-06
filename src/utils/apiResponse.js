const httpStatus = require('http-status');

const sendResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    data,
    message
  });
};

module.exports = { sendResponse };