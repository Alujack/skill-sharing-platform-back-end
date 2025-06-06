const prisma = require('../prisma');
const ApiError = require('../utils/apiError');

class CourseService {
  async createCourse(instructorId, courseData) {
    return await prisma.course.create({
      data: {
        ...courseData,
        instructorId
      },
      include: {
        category: true,
        instructor: {
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  async getCourseById(courseId) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: {
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        lessons: true
      }
    });

    if (!course) throw new ApiError(404, 'Course not found');
    return course;
  }

  async updateCourse(courseId, instructorId, updateData) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId }
    });

    if (!course) throw new ApiError(403, 'Not authorized or course not found');

    return await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: { category: true }
    });
  }

  async deleteCourse(courseId, instructorId) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId }
    });

    if (!course) throw new ApiError(403, 'Not authorized or course not found');

    await prisma.course.delete({ where: { id: courseId } });
    return { success: true };
  }

  async listCourses(filters = {}) {
    return await prisma.course.findMany({
      where: filters,
      include: {
        category: true,
        instructor: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: { lessons: true, enrollments: true }
        }
      }
    });
  }
}

module.exports = new CourseService();