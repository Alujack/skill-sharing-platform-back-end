const prisma = require('../prisma');
const ApiError = require('../utils/apiError');

const checkCourseOwnership = async (req, res, next) => {
  const course = await prisma.course.findFirst({
    where: {
      id: Number(req.params.id),
      instructorId: req.user.id
    }
  });

  if (!course && req.user.role !== 'Admin') {
    return next(new ApiError(403, 'You do not own this course'));
  }

  next();
};

module.exports = { checkCourseOwnership };