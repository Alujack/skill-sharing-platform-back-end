const prisma = require('../prisma');

const getAllCourses = async (search, filters = {}) => {
  const { categoryId, isApproved, instructorId } = filters;
  console.log('getAllCourses called with:', { search, categoryId, isApproved, instructorId });

  // Build where conditions
  const where = {};

  const conditions = [];

  if (search) {
    conditions.push({
      title: {
        contains: search,
        mode: 'insensitive',
      }
    });
  }

  if (categoryId) {
    conditions.push({
      categoryId: parseInt(categoryId)
    });
  }

  // isApproved might be a string from query param, so check and convert
  if (typeof isApproved === 'string' && isApproved !== '') {
    conditions.push({
      isApproved: isApproved === 'true'
    });
  }

  if (instructorId) {
    conditions.push({
      instructorId: parseInt(instructorId)
    });
  }

  if (conditions.length > 0) {
    where.AND = conditions;
  }

  return prisma.course.findMany({
    where,
    include: {
      category: true,
      instructor: true, // change to true if your frontend expects instructor.name directly
      // if you want user under instructor, change accordingly and update frontend
    },
  });
};


const getCourseById = async (id) => {
  return prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      instructor: { include: { user: true } },
      lessons: true,
    },
  });
};

const getInstructorCourses = async (userId) => {
  const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });
  if (!instructor) return null;

  return prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: { category: true },
  });
};

const createCourse = async (userId, data) => {
  const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });
  if (!instructor) return null;

  return prisma.course.create({
    data: {
      ...data,
      instructorId: instructor.id,
    },
  });
};

const updateCourse = async (userId, courseId, data) => {
  const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });
  if (!instructor) return { error: 'NotInstructor' };

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== instructor.id) return { error: 'Unauthorized' };

  return prisma.course.update({
    where: { id: courseId },
    data,
  });
};

const deleteCourse = async (userId, courseId) => {
  const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course || course.instructorId !== instructor?.id) return false;

  await prisma.course.delete({ where: { id: courseId } });
  return true;
};

module.exports = {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
