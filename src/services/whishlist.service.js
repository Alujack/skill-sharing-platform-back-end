const prisma = require('../prisma');

exports.getWishlistByStudentId = async (studentId) => {
  const parsedId = parseInt(studentId);
  return await prisma.wishlist.findMany({
    where: { studentId: parsedId },
    include: { course: true, student: true }
  });
};

exports.addCourseToWishlist = async (studentId, courseId) => {
  const parsedStudentId = parseInt(studentId);
  const parsedCourseId = parseInt(courseId);

  const existing = await prisma.wishlist.findFirst({
    where: { studentId: parsedStudentId, courseId: parsedCourseId }
  });

  if (existing) {
    throw new Error('Course already in wishlist');
  }

  return await prisma.wishlist.create({
    data: { studentId: parsedStudentId, courseId: parsedCourseId },
    include: { course: true, student: true }
  });
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