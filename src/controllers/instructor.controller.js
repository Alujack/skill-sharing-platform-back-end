const httpStatus = require('http-status');
const { sendResponse } = require('../utils/apiResponse');
const instructorService = require('../services/instructor.service');

class InstructorController {
  async getDashboard(req, res, next) {
    try {
      const stats = await instructorService.getInstructorStats(req.user.id);
      sendResponse(res, httpStatus.OK, stats, 'Dashboard data fetched');
    } catch (error) {
      next(error);
    }
  }

  async getStudents(req, res, next) {
    try {
      const students = await instructorService.getInstructorStudents(req.user.id);
      sendResponse(res, httpStatus.OK, students, 'Students list fetched');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InstructorController();