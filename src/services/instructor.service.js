import prisma from '../prisma/client.js';

class InstructorService {
  // Get Dashboard Stats (Courses, Enrollments, Revenue)
  static async getDashboardStats(instructorId) {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: true,
      },
    });

    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.enrollments.length), 0);

    return { totalCourses, totalEnrollments, totalRevenue };
  }

  // Get Students enrolled in Instructor's courses
  static async getStudents(instructorId) {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: {
          include: {
            user: true,
          },
        },
      },
    });

    const students = courses.flatMap(course =>
      course.enrollments.map(enrollment => enrollment.user)
    );

    return students;
  }

  // Approve Instructor (Admin-only)
  static async approveInstructor(userId) {
    const instructor = await prisma.instructorProfile.update({
      where: { userId: parseInt(userId) },
      data: { isApproved: true },
      include: { user: true },
    });


    // Update user role to Instructor
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'Instructor' },
    });

    return instructor;
  }
}

export default InstructorService;