const express = require('express');
const router = express.Router();
const controller = require('../controllers/enrollment.controller');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// Dummy middleware to simulate logged-in user if not using JWT
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.post(
  '/',
  requireAuth,
  validate([body('course_id').isInt().withMessage('course_id must be an integer')]),
  controller.enrollInCourse
);

router.get('/:id', requireAuth, controller.getEnrollmentById);
router.get('/:id', requireAuth, controller.getUserEnrollments);
router.get('/course/:id', requireAuth, controller.getCourseEnrollments);

module.exports = router;
