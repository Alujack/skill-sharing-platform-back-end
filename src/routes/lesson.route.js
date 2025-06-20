const express = require('express');
const router = express.Router();
const { getAllLessons, getLessonByCourse, getLessonById, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons.controller');

// Get all lessons
router.get('/', getAllLessons);

// Get lessons by course ID
router.get('/course/:courseId', getLessonByCourse);

// Get a single lesson by ID
router.get('/:lessonId', getLessonById);

// Create a new lesson
router.post('/', createLesson);

// Update a lesson
router.put('/:lessonId', updateLesson);

// Delete a lesson
router.delete('/:lessonId', deleteLesson);

module.exports = router;