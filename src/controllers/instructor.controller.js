const InstructorService = require('../services/instructor.service');
const CourseService = require('../services/course.service');
const { number } = require('joi');

// GET /instructors/dashboard?instructorId=...
const getInstructorDashboard = async (req, res) => {
  try {
    const { instructorId } = req.query; // get from query as you requested
    console.log(`Fetching dashboard for instructor ID: ${instructorId}`);
    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    const dashboardStats = await InstructorService.getDashboardStats(instructorId);
    res.status(200).json(dashboardStats);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// GET /instructors/:instructorId/students
const getInstructorStudents = async (req, res) => {
  try {
    const { instructorId } = req.query;
    console.log(`Fetching students for instructor ID: ${instructorId}`);

    if (!instructorId) {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    const students = await InstructorService.getStudents(instructorId);
    res.status(200).json(students);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// POST /admin/instructors/:userId/approve
const approveInstructorProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    const approvedInstructor = await InstructorService.approveInstructor(userId);
    res.status(200).json(approvedInstructor);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// GET /instructors/:id/courses
const getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Instructor ID is required' });
    }

    const courses = await CourseService.getInstructorCourses(Number(id));
    res.status(200).json(courses);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
const becomeToInstrutor = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`User ID: ${userId}`);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const instructor = await InstructorService.becomeToInstrutor(userId, req.body);
    res.status(200).json(instructor);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getPendingInstructors = async (req, res) => {
  try {
    const pendingInstructors = await InstructorService.getPendingInstructors();
    res.status(200).json({ success: true, data: pendingInstructors });
  } catch (error) {
    console.error('Error fetching pending instructors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getApprovedInstructors = async (req, res) => {
  try {
    const pendingInstructors = await InstructorService.getApprocedInstructors();
    res.status(200).json({ success: true, data: pendingInstructors });
  } catch (error) {
    console.error('Error fetching pending instructors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const getAllInstructors = async (req, res) => {
  try {
    const allInstructors = await InstructorService.getAllInstructors();
    res.status(200).json({ success: true, data: allInstructors });
  } catch (error) {
    console.error('Error fetching all instructors:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  getInstructorDashboard,
  getInstructorStudents,
  approveInstructorProfile,
  getInstructorCourses,
  becomeToInstrutor,
  getPendingInstructors,
  getApprovedInstructors,
  getAllInstructors
};
