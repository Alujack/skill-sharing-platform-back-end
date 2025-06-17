const express = require('express');
const router = express.Router();
const controller = require('../controllers/course.controller');
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');
const { body, validationResult } = require('express-validator');

// Middleware for validation
const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// Course fields validation
const courseValidation = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('category_id').isInt(),
];

// Public
router.get('/', controller.getAllCourses);
router.get('/instructor/:id', controller.getInstructorCourses);
router.get('/:id', controller.getCourseById);

router.post('/', controller.createCourse);
router.put('/:id', controller.updateCourse);
router.delete('/:id', controller.deleteCourse);

module.exports = router;
