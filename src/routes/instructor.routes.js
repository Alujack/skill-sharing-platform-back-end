const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');
const instructorController = require('../controllers/instructor.controller');

router.use(auth, authorizeRoles('Instructor'));

router.get('/dashboard', instructorController.getDashboard);
router.get('/students', instructorController.getStudents);

module.exports = router;