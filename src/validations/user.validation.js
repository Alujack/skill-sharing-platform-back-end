const { body } = require('express-validator');

exports.updateUserValidation = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('role').isIn(['Admin', 'Instructor', 'User', 'Student']),
];

exports.instructorProfileValidation = [
  body('bio').notEmpty(),
];
