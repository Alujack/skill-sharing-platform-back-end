const prisma = require('../prisma');
const ApiError = require('../utils/apiError');

const checkEnrollmentOwnership = async (req, res, next) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: req.user.id,
        courseId: Number(req.params.courseId)
      }
    }
  });

  if (!enrollment && req.user.role !== 'Admin') {
    return next(new ApiError(403, 'Not enrolled in this course'));
  }

  next();
};

module.exports = { checkEnrollmentOwnership };