const prisma = require('../prisma');

// Dashboard stats: counts courses and enrolled students for given instructorId
const getDashboardStats = async (instructorId) => {
  const instructorIdInt = parseInt(instructorId);
  if (isNaN(instructorIdInt)) {
    throw new Error('Invalid instructor ID');
  }
  const instructor = await prisma.instructor.findUnique({
    where: { userId: instructorIdInt }
  })

  const coursesCount = await prisma.course.count({
    where: { instructorId: instructor.id },
  });

  const studentsCount = await prisma.enrollment.count({
    where: {
      course: {
        instructorId: instructor.id,
      },
    },
  });

  return { coursesCount, studentsCount };
};

// Get all students enrolled in instructor's courses
const getStudents = async (instructorId) => {
  const instructorIdInt = parseInt(instructorId);
  if (isNaN(instructorIdInt)) throw new Error('Invalid instructor ID');
  const instructor = await prisma.instructor.findUnique({
    where: { userId: instructorIdInt }
  })

  // Find all enrollments where course belongs to instructor
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        instructorId: instructor.id,
      },
    },
    select: {
      student: {
        select: {
          id: true,
          name: true,
          phone: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    distinct: ['studentId'],
  });

  // Map the results to flatten the structure
  const uniqueStudents = enrollments.map(enrollment => ({
    id: enrollment.student.id,
    name: enrollment.student.name,
    phone: enrollment.student.phone,
    email: enrollment.student.user.email,
  }));

  return uniqueStudents;
};


const approveInstructor = async (userId) => {
  console.log("approving instructor with userId:", userId);
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

const becomeToInstrutor = async (userId, data) => {
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
      isApproved: false,
      name: data.name,
      phone: data.phone,
      bio: data.bio,
    },
  });

  // Update user role
  await prisma.user.update({
    where: { id: userIdInt },
    data: {
      role: 'Instructor',
    },
  });

  return instructor;
};
const getPendingInstructors = async () => {
  const pendingInstructors = await prisma.instructor.findMany({
    where: {
      isApproved: false,
    },
    include: {
      user: true, // Optional: include user details related to each instructor
    },
  });

  return pendingInstructors;
};
const getApprocedInstructors = async () => {
  const pendingInstructors = await prisma.instructor.findMany({
    where: {
      isApproved: true,
    },
    include: {
      user: true, // Optional: include user details related to each instructor
    },
  });

  return pendingInstructors;
};
const getAllInstructors = async () => {
  const allInstructors = await prisma.instructor.findMany({
    include: {
      user: true,
    },
  });

  return allInstructors;
};

const deleteInstructor = async (instructorIdParam) => {
  try {
    console.log('Starting deleteInstructor with param:', instructorIdParam);

    const instructorId = parseInt(instructorIdParam);
    console.log('Parsed instructorId:', instructorId);

    // First find the instructor to get the userId
    console.log('Looking for instructor...');
    const instructor = await prisma.instructor.findUnique({
      where: { id: instructorId }
    });
    console.log('Found instructor:', instructor);

    if (!instructor) {
      throw new Error('Instructor not found');
    }

    console.log('Starting transaction to delete related records...');

    // Delete all related records in a transaction
    const result = await prisma.$transaction([
      // Delete all lessons for courses by this instructor
      prisma.lesson.deleteMany({
        where: {
          course: {
            instructorId: instructorId
          }
        }
      }),
      // Delete all enrollments for courses by this instructor
      prisma.enrollment.deleteMany({
        where: {
          course: {
            instructorId: instructorId
          }
        }
      }),
      // Delete all wishlists for courses by this instructor
      prisma.wishlist.deleteMany({
        where: {
          course: {
            instructorId: instructorId
          }
        }
      }),
      // Delete all courses by this instructor
      prisma.course.deleteMany({
        where: {
          instructorId: instructorId
        }
      }),
      // Delete the instructor
      prisma.instructor.delete({
        where: { id: instructorId }
      }),
      // Delete the user
      prisma.user.delete({
        where: { id: instructor.userId }
      })
    ]);

    console.log('Transaction completed successfully:', result);
    return result;

  } catch (error) {
    console.error('Error in deleteInstructor:', error);
    throw error; // Re-throw the error after logging
  }
};
const updateInstructor = async (instructorId, updateData) => {
  const updatedInstructor = await prisma.instructor.update({
    where: { id: instructorId },
    data: updateData,
  });
  return updatedInstructor
};




module.exports = {
  getDashboardStats,
  getStudents,
  approveInstructor,
  becomeToInstrutor,
  getPendingInstructors,
  getApprocedInstructors,
  getAllInstructors,
  deleteInstructor,
  updateInstructor
};
