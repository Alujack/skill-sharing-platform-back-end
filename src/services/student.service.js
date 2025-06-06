const prisma = require('../prisma');

class StudentService {
  async getStudentProgress(studentId) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            lessons: true,
            _count: { select: { lessons: true } }
          }
        },
        completedLessons: true
      }
    });
  }

  async updateProgress(studentId, lessonId) {
    return await prisma.completedLesson.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      create: { studentId, lessonId },
      update: {}
    });
  }
}

module.exports = new StudentService();