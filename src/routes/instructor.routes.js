import express from 'express';
import {
    getInstructorDashboard,
    getInstructorStudents,
    approveInstructorProfile,
    getInstructorCourses
} from '../controllers/instructor.controller.js';
import { auth, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Instructor Dashboard (Protected)
router.get('/dashboard', auth, authorizeRoles('Instructor'), getInstructorDashboard);

// Get Students enrolled in Instructor's courses
router.get('/students', auth, authorizeRoles('Instructor'), getInstructorStudents);

// Admin approves an Instructor
router.put('/approve/:userId', auth, authorizeRoles('Admin'), approveInstructorProfile);

// Get all courses by Instructor (Public)
router.get('/:id/courses', getInstructorCourses);

export default router;