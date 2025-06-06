const prisma = require('../prisma');

class AdminService {
  async getPlatformStats() {
    const [users, courses, enrollments] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count()
    ]);
    return { users, courses, enrollments };
  }

  async approveInstructor(userId) {
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: { role: 'Instructor' },
      include: { instructorProfile: true }
    });
  }
}

module.exports = new AdminService();