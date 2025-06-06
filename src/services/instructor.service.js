const prisma = require('../prisma');

class InstructorService {
  async getInstructorStats(instructorId) {
    return await prisma.course.aggregate({
      where: { instructorId },
      _count: { enrollments: true },
      _sum: { price: true }
    });
  }

  async getInstructorStudents(instructorId) {
    return await prisma.enrollment.findMany({
      where: { course: { instructorId } },
      include: {
        student: { select: { id: true, name: true, email: true } },
        course: { select: { title: true } }
      }
    });
  }
}

module.exports = new InstructorService();