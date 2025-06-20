const express = require('express');
const router = express.Router();
const controller = require('../controllers/enrollment.controller');

router.post(
  '/',
  controller.enrollInCourse
);

router.get('/:id', controller.getEnrollmentById);
router.get('/:id', controller.getUserEnrollments);
router.get('/course/:id', controller.getCourseEnrollments);

module.exports = router;
