import InstructorService from '../services/instructor.service.js';
import EnrollmentService from '../services/enrollment.service.js';
import CourseService from '../services/course.service.js';

// Get Instructor Dashboard Stats
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const dashboardStats = await InstructorService.getDashboardStats(instructorId);
    res.status(200).json(dashboardStats);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get Students enrolled in Instructor's courses
export const getInstructorStudents = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const students = await InstructorService.getStudents(instructorId);
    res.status(200).json(students);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Admin approves an Instructor
export const approveInstructorProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const approvedInstructor = await InstructorService.approveInstructor(userId);
    res.status(200).json(approvedInstructor);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Get all courses by Instructor (Public)
export const getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await CourseService.getCoursesByInstructor(id);
    res.status(200).json(courses);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};