const httpStatus = require('http-status');
const { sendResponse } = require('../utils/apiResponse');
const adminService = require('../services/admin.service');

class AdminController {
  async getPlatformStats(req, res, next) {
    try {
      const stats = await adminService.getPlatformStats();
      sendResponse(res, httpStatus.OK, stats, 'Platform stats fetched');
    } catch (error) {
      next(error);
    }
  }

  async approveInstructor(req, res, next) {
    try {
      const instructor = await adminService.approveInstructor(req.params.userId);
      sendResponse(res, httpStatus.OK, instructor, 'Instructor approved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();