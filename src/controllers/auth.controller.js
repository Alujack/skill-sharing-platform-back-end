const httpStatus = require('http-status');
const { sendResponse } = require('../utils/apiResponse');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const { createUser } = require('../services/user.service');
const { loginWithEmailAndPassword, getMe } = require('../services/auth.service');


const register = async (req, res) => {
  try {
    const validatedData = await registerValidation.validateAsync(req.body);
    const user = await createUser(validatedData);

    return res.status(201).json({
      success: true,
      data: user,
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginWithEmailAndPassword(email, password);
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        user: userResponse,
        token
      },
    });

  } catch (error) {
    console.error('error', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
};

const logout = (req, res) => {
  res.clearCookie('token');
  sendResponse(res, 200, null, 'Logout successful');
};

const getCurrentUser = async (req, res, next) => {
  console.log("this is request == ", req.user)
  try {
    const user = await getMe(req.user.id);
    res.status(200).json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

module.exports = { register, login, logout, getCurrentUser }; 