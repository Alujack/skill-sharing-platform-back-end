const prisma = require('../prisma');

// Dashboard stats: counts courses and enrolled students for given instructorId
const getDashboardStats = async (instructorId) => {
  const instructorIdInt = parseInt(instructorId, 10);
  if (isNaN(instructorIdInt)) {
    throw new Error('Invalid instructor ID');
  }

  const coursesCount = await prisma.course.count({
    where: { instructorId: instructorIdInt },
  });

  const studentsCount = await prisma.enrollment.count({
    where: {
      course: {
        instructorId: instructorIdInt,
      },
    },
  });

  return { coursesCount, studentsCount };
};

// Get all students enrolled in instructor's courses
const getStudents = async (instructorId) => {
  const instructorIdInt = parseInt(instructorId, 10);
  if (isNaN(instructorIdInt)) throw new Error('Invalid instructor ID');

  // Find all enrollments where course belongs to instructor,
  // and include the student and their user info (for email)
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId: instructorIdInt,
      },
    },
    select: {
      student: {
        select: {
          id: true,
          name: true,
          phone: true,
          user: {           // fetch the related User record for email
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  // Map to get the student info including email from user
  return enrollments.map((enrollment) => ({
    id: enrollment.student.id,
    name: enrollment.student.name,
    phone: enrollment.student.phone,
    email: enrollment.student.user.email,
  }));
};


const approveInstructor = async (userId) => {
  const userIdInt = parseInt(userId, 10);
  if (isNaN(userIdInt)) {
    throw new Error('Invalid user ID');
  }

  // Check if user exists and is an instructor
  const user = await prisma.user.findUnique({
    where: { id: userIdInt },
  });

  if (!user || user.role !== 'Instructor') {
    throw new Error('Instructor not found');
  }

  // Update the Instructor record where userId = userIdInt
  const updatedInstructor = await prisma.instructor.update({
    where: { userId: userIdInt },
    data: { isApproved: true },
  });

  return updatedInstructor;
};

const becomeToInstrutor = async (userId) => {
  const userIdInt = parseInt(userId, 10);
  if (isNaN(userIdInt)) {
    throw new Error('Invalid user ID');
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userIdInt },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create an Instructor record for the user
  const instructor = await prisma.instructor.create({
    data: {
      userId: userIdInt,
      isApproved: false, // Initially not approved
    },
  });

  return instructor;
};


module.exports = {
  getDashboardStats,
  getStudents,
  approveInstructor,
  becomeToInstrutor
};
