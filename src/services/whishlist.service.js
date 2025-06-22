const prisma = require('../prisma');

exports.getWishlistByStudentId = async (userId) => {
  const student = await prisma.student.findFirst({
    where: {
      userId: Number(userId)
    },
    select: {
      id: true
    }
  });

  if (!student) {
    throw new Error('Student not found for this user');
  }
  return await prisma.wishlist.findMany({
    where: { studentId: student.id },
    include: { course: true }
  });
};

exports.addCourseToWishlist = async (userId, courseId) => {
  try {
    const student = await prisma.student.findFirst({
      where: {
        userId: Number(userId)
      },
      select: {
        id: true
      }
    });

    if (!student) {
      throw new Error('Student not found for this user');
    }

    const parsedCourseId = Number(courseId);
    const existing = await prisma.wishlist.findFirst({
      where: {
        studentId: student.id,
        courseId: parsedCourseId
      }
    });

    if (existing) {
      throw new Error('Course already in wishlist');
    }

    return await prisma.wishlist.create({
      data: {
        studentId: student.id,
        courseId: parsedCourseId
      },
      include: {
        course: true,
        student: {
          include: {
            user: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in addCourseToWishlist:', error);
    throw error;
  }
};

exports.removeWishlistItem = async (id) => {
  const parsedId = parseInt(id);

  const item = await prisma.wishlist.findUnique({
    where: { id: parsedId }
  });

  if (!item) {
    throw new Error('Wishlist item not found');
  }

  return await prisma.wishlist.delete({
    where: { id: parsedId },
    include: { course: true }
  });
};

exports.clearStudentWishlist = async (studentId) => {
  const parsedId = parseInt(studentId);
  return await prisma.wishlist.deleteMany({
    where: { studentId: parsedId }
  });
};