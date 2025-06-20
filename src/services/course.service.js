const prisma = require('../prisma');

const getAllCourses = async (search, filters = {}) => {
  const { categoryId, isApproved, instructorId } = filters;
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
      instructor: true,
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
  const instructor = await prisma.instructor.findUnique({ where: { userId } });
  console.log('instructor:', instructor);
  if (!instructor) return null;

  return prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: { category: true },
  });
};

const createCourse = async (userId, data) => {
  const instructor = await prisma.instructor.findUnique({ where: { userId: userId } });
  if (!instructor) return null;
  return prisma.course.create({
    data: {
      ...data,
      instructorId: instructor.id,
    },
  });
};


const updateCourse = async (courseId, data) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return false;

  return prisma.course.update({
    where: { id: courseId },
    data,
  });
};

const deleteCourse = async (courseId) => {
  console.log('course id ==', courseId)
  const course = await prisma.course.findUnique({ where: { id: courseId } });


  if (!course) return false;

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
