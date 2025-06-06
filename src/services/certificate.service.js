const prisma = require('../prisma');
const pdfService = require('./pdf.service');

class CertificateService {
  async generateCertificate(userId, courseId) {
    const [enrollment, user, course] = await Promise.all([
      prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: userId, courseId } }
      }),
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.course.findUnique({ where: { id: courseId } })
    ]);

    return pdfService.generateCertificate(
      user.name,
      course.title,
      new Date()
    );
  }
}

module.exports = new CertificateService();