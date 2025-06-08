const express = require('express');
const {
    getInstructorDashboard,
    getInstructorStudents,
    approveInstructorProfile,
    getInstructorCourses,
    becomeToInstrutor

} = require('../controllers/instructor.controller');
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Instructor Dashboard (Protected)
router.get('/dashboard', getInstructorDashboard);

// Get Students enrolled in Instructor's courses
router.get('/students', getInstructorStudents);

// Admin approves an Instructor
router.put('/approve/:userId', approveInstructorProfile);

// Get all courses by Instructor (Public)
router.get('/:id/courses', getInstructorCourses);
// Become an Instructor (Protected)
router.post('/become-instructor', becomeToInstrutor)

module.exports = router;
