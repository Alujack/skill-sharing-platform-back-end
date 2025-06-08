const InstructorService = require('../services/instructor.service');
const CourseService = require('../services/course.service');

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
    const { instructorId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const approvedInstructor = await InstructorService.approveInstructor(instructorId);
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

    const courses = await CourseService.getCoursesByInstructor(id);
    res.status(200).json(courses);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
const becomeToInstrutor = async (req, res) => {
  try {
    const { userId } = req.query; // get from query as you requested
    console.log(`User ID: ${userId}`);
    if (!userId) {  
      return res.status(400).json({ message: 'User ID is required' });
    }   
    const instructor = await InstructorService.becomeToInstrutor(userId);
    res.status(200).json(instructor);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
//

module.exports = {
  getInstructorDashboard,
  getInstructorStudents,
  approveInstructorProfile,
  getInstructorCourses,
  becomeToInstrutor
};
