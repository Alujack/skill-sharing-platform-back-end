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

  console.log('getAllCourses where condition:', JSON.stringify(where, null, 2));

  const result = await prisma.course.findMany({
    where,
    include: {
      category: true,
      instructor: true,
    },
  });

  console.log('getAllCourses result count:', result.length);
  return result;
};

const getCourseById = async (id) => {
  console.log('getCourseById - searching for id:', id);
  const result = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      instructor: { include: { user: true } },
      lessons: true,
    },
  });
  console.log('getCourseById result:', result ? 'Found' : 'Not found');
  return result;
};

const getInstructorCourses = async (userId) => {
  console.log('getInstructorCourses - userId:', userId);
  const instructor = await prisma.instructor.findUnique({ where: { userId: parseInt(userId) } });
  console.log("instructor ==", instructor);
  if (!instructor) return null;

  const courses = await prisma.course.findMany({
    where: { instructorId: instructor.id },
    include: { category: true },
  });
  console.log('getInstructorCourses result count:', courses.length);
  return courses;
};

const getRecentCourses = async (limit = 10) => {
  console.log('getRecentCourses - limit:', limit);

  // First, let's check if there are any courses at all
  const totalCourses = await prisma.course.count();
  console.log('Total courses in database:', totalCourses);

  // Check how many approved courses
  const approvedCourses = await prisma.course.count({
    where: { isApproved: true }
  });
  console.log('Total approved courses:', approvedCourses);

  const result = await prisma.course.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
  });

  console.log('getRecentCourses result count:', result.length);
  return result;
};

const getBestSellingCourses = async (limit = 10) => {
  console.log('getBestSellingCourses - limit:', limit);

  const result = await prisma.course.findMany({
    where: { isApproved: true },
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: {
      enrollments: {
        _count: 'desc'
      }
    },
    take: limit,
  });

  console.log('getBestSellingCourses result count:', result.length);
  return result;
};

const getRecommendedCourses = async (userId = null, limit = 10) => {
  console.log('getRecommendedCourses - userId:', userId, 'limit:', limit);

  // If user is provided, we can implement personalized recommendations
  if (userId) {
    console.log('Getting personalized recommendations for userId:', userId);

    // Get user's enrolled categories for personalized recommendations
    const userEnrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { course: { include: { category: true } } }
    });

    console.log('User enrollments count:', userEnrollments.length);

    const userCategories = [...new Set(userEnrollments.map(e => e.course.categoryId))];
    console.log('User categories:', userCategories);

    if (userCategories.length > 0) {
      const result = await prisma.course.findMany({
        where: {
          isApproved: true,
          categoryId: { in: userCategories },
          NOT: {
            enrollments: {
              some: { userId: parseInt(userId) }
            }
          }
        },
        include: {
          category: true,
          instructor: { include: { user: true } },
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: [
          { enrollments: { _count: 'desc' } },
          { createdAt: 'desc' }
        ],
        take: limit,
      });

      console.log('Personalized recommendations count:', result.length);
      return result;
    }
  }

  // Default recommendations: mix of popular and recent courses
  console.log('Getting default recommendations');
  const result = await prisma.course.findMany({
    where: { isApproved: true },
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: [
      { enrollments: { _count: 'desc' } },
      { createdAt: 'desc' }
    ],
    take: limit,
  });

  console.log('Default recommendations count:', result.length);
  return result;
};

const getCoursesByCategory = async (categoryId, limit = null) => {
  console.log('getCoursesByCategory - categoryId:', categoryId, 'limit:', limit);

  const query = {
    where: {
      categoryId: parseInt(categoryId),
      isApproved: true
    },
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: [
      { enrollments: { _count: 'desc' } },
      { createdAt: 'desc' }
    ],
  };

  if (limit) {
    query.take = limit;
  }

  console.log('getCoursesByCategory query:', JSON.stringify(query, null, 2));

  const result = await prisma.course.findMany(query);
  console.log('getCoursesByCategory result count:', result.length);
  return result;
};

// Alternative versions without isApproved filter for testing
const getRecentCoursesNoFilter = async (limit = 10) => {
  console.log('getRecentCoursesNoFilter - limit:', limit);

  const result = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
  });

  console.log('getRecentCoursesNoFilter result count:', result.length);
  return result;
};

const getBestSellingCoursesNoFilter = async (limit = 10) => {
  console.log('getBestSellingCoursesNoFilter - limit:', limit);

  const result = await prisma.course.findMany({
    include: {
      category: true,
      instructor: { include: { user: true } },
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: {
      enrollments: {
        _count: 'desc'
      }
    },
    take: limit,
  });

  console.log('getBestSellingCoursesNoFilter result count:', result.length);
  return result;
};

const createCourse = async (id, data) => {
  const userId = parseInt(id);
  const instructor = await prisma.instructor.findUnique({ where: { userId } });
  console.log('createCourse - instructor:', instructor);

  if (!instructor) return null;
  const result = await prisma.course.create({
    data: {
      ...data,
      instructorId: instructor.id,
    },
  });
  console.log('Course created with id:', result.id);
  return result;
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
  getRecentCourses,
  getBestSellingCourses,
  getRecommendedCourses,
  getCoursesByCategory,
  getRecentCoursesNoFilter,
  getBestSellingCoursesNoFilter,
  createCourse,
  updateCourse,
  deleteCourse,
};