const express = require('express');
const router = express.Router();
const { getAllLessons, getLessonByCourse, getLessonById, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons.controller');
const upload = require('../middlewares/upload');

// Get all lessons
router.get('/', getAllLessons);

// Get lessons by course ID
router.get('/course/:courseId', getLessonByCourse);

// Get a single lesson by ID
router.get('/:lessonId', getLessonById);

// Create a new lesson
router.post('/upload', upload.single('video'), createLesson);

// Update a lesson
router.put('/:lessonId', upload.single('video'), updateLesson);

// Delete a lesson
router.delete('/:lessonId', deleteLesson);

module.exports = router;