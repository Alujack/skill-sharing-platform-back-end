const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentEnrollments
} = require('../controllers/students.controller');


router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/learning/:id', getStudentEnrollments)

module.exports = router; 