const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students.controller');
// const { auth, authorizeRoles } = require('../middlewares/auth.middleware');

// router.use(auth, authorizeRoles('User'));

router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router; 