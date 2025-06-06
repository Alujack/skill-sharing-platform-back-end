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
    if (error.isJoi) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    

    if (error.code === 'P2002') { 
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = await loginValidation.validateAsync(req.body);
    const { user, token } = await loginWithEmailAndPassword(email, password);
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });
  

    // Prepare user response without sensitive data
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
    const {OK} = httpStatus;
    console.log("status code  ==",  OK)

    // Send response
    sendResponse(res, 200, { 
      user: userResponse, 
      token 
    }, 'Login successful');

  } catch (error) {
    // Handle specific error cases
    if (error.isJoi) {
      return sendResponse(res, httpStatus.BAD_REQUEST, null, error.details[0].message);
    }
    
    if (error.message === 'Incorrect email or password') {
      return sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Invalid credentials');
    }

    next(error);
  }
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
    next(error);
  }
};

module.exports = { register, login, logout, getCurrentUser };