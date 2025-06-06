const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const { register, login, logout, getCurrentUser } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth(), getCurrentUser);
module.exports = router;