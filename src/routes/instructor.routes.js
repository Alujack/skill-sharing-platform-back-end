const express = require('express');
const {
    getInstructorDashboard,
    getInstructorStudents,
    approveInstructorProfile,
    getInstructorCourses,
    becomeToInstrutor,
    getPendingInstructors,
    getApprovedInstructors,
    getAllInstructors

} = require('../controllers/instructor.controller');
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');

const router = express.Router();

// Instructor Dashboard (Protected)
router.get('/dashboard', getInstructorDashboard);

// Get Students enrolled in Instructor's courses
router.get('/students', getInstructorStudents);

// Admin approves an Instructor
router.put('/approve', approveInstructorProfile);

// Get all courses by Instructor (Public)
router.get('/:id/courses', getInstructorCourses);
// Become an Instructor (Public)
router.post('/become-instructor', becomeToInstrutor)

router.get('/pending', getPendingInstructors)
router.get('/approved', getApprovedInstructors)
router.get('/all', getAllInstructors);

module.exports = router;
