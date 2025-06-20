const studentService = require('../services/student.service');
const { validationResult } = require('express-validator');


const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const student = await studentService.getStudentById(studentId);

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Get student error:', error);

    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

const createStudent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required',
      });
    }

    const student = await studentService.createStudent({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Create student error:', error);

    if (error.message === 'User already exists') {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const studentId = parseInt(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const { name, phone, isVerified } = req.body;

    const updatedStudent = await studentService.updateStudent(studentId, {
      name,
      phone,
      isVerified,
    });

    res.status(200).json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Update student error:', error);

    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    await studentService.deleteStudent(studentId);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);

    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const enrollments = await studentService.getStudentEnrollments(studentId);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error('Get student enrollments error:', error);

    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};


const getStudentWishlist = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    if (isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid student ID',
      });
    }

    const wishlist = await studentService.getStudentWishlist(studentId);

    res.status(200).json({
      success: true,
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    console.error('Get student wishlist error:', error);

    if (error.message === 'Student not found') {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
};

module.exports = {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentEnrollments,
  getStudentWishlist,
};