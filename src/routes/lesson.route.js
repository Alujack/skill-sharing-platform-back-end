const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessons.controller');

// Get all lessons
router.get('/', lessonController.getAllLessons);

// Get lessons by course ID
router.get('/course/:courseId', lessonController.getLessonByCourse);

// Get a single lesson by ID
router.get('/:lessonId', lessonController.getLessonById);

// Create a new lesson
router.post('/create', lessonController.createLesson);

// Update a lesson
router.put('/:lessonId', lessonController.updateLesson);

// Delete a lesson
router.delete('/:lessonId', lessonController.deleteLesson);

module.exports = router;