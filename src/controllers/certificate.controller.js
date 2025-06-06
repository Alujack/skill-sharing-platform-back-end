const httpStatus = require('http-status');
const { sendResponse } = require('../utils/apiResponse');
const certificateService = require('../services/certificate.service');

class CertificateController {
  async getCertificate(req, res, next) {
    try {
      const pdf = await certificateService.generateCertificate(
        req.user.id,
        Number(req.params.courseId)
      );
      
      res.setHeader('Content-Type', 'application/pdf');
      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CertificateController();