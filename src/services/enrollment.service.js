const prisma = require('../prisma');
const ApiError = require('../utils/apiError');
const courseService = require('./course.service');

class EnrollmentService {
  async enrollStudent(studentId, courseId) {
    // Check if course exists
    await courseService.getCourseById(courseId);

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      throw new ApiError(400, 'Already enrolled in this course');
    }

    return await prisma.enrollment.create({
      data: {
        studentId,
        courseId
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async getStudentEnrollments(studentId) {
    return await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            category: true,
            _count: {
              select: { lessons: true }
            }
          }
        }
      }
    });
  }

  async getCourseEnrollments(courseId, instructorId) {
    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId }
    });

    if (!course) throw new ApiError(403, 'Not authorized or course not found');

    return await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }
}

module.exports = new EnrollmentService();