const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { isAdmin, isSelfOrAdmin } = require('../middlewares/user.middleware');
const { updateUserValidation, instructorProfileValidation } = require('../validations/user.validation');
const { validationResult } = require('express-validator');

// Simple wrapper to handle express-validator errors
const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.put('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

router.post('/:id/instructor', validate(instructorProfileValidation), controller.createInstructorProfile);
router.put('/:id/instructor', isSelfOrAdmin, validate(instructorProfileValidation), controller.updateInstructorProfile);

module.exports = router;
