const prisma = require('../prisma');
const bcrypt = require('bcryptjs');

class StudentService {
  /**
   * Get all students with their user info and enrollments
   * @returns {Promise<Array>} Array of students
   */
  async getAllStudents() {
    try {
      const students = await prisma.student.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isVerified: true,
              createdAt: true,
            },
          },
          enrollments: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return students.map((student) => ({
        id: student.id,
        name: student.name,
        phone: student.phone,
        email: student.user.email,
        isVerified: student.user.isVerified,
        createdAt: student.user.createdAt,
        enrollments: student.enrollments,
      }));
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error.message}`);
    }
  }

  /**
   * Get single student by ID with detailed information
   * @param {number} studentId - Student ID
   * @returns {Promise<Object>} Student details
   */
  async getStudentById(studentId) {
    try {
      const student = await prisma.student.findUnique({
        where: {
          id: studentId,
        },
        include: {
          user: {
            select: {
              email: true,
              isVerified: true,
              createdAt: true,
            },
          },
          enrollments: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  price: true,
                  instructor: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          wishlists: {
            select: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new Error('Student not found');
      }

      return {
        id: student.id,
        name: student.name,
        phone: student.phone,
        email: student.user.email,
        isVerified: student.user.isVerified,
        createdAt: student.user.createdAt,
        enrollments: student.enrollments,
        wishlists: student.wishlists,
      };
    } catch (error) {
      throw new Error(`Failed to fetch student: ${error.message}`);
    }
  }

  /**
   * Create a new student with user account
   * @param {Object} studentData - Student data
   * @param {string} studentData.name - Student name
   * @param {string} studentData.email - Student email
   * @param {string} studentData.password - Student password
   * @param {string} studentData.phone - Student phone
   * @returns {Promise<Object>} Created student
   */
  async createStudent({ name, email, password, phone }) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user and student in a transaction
      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'Student',
            isVerified: false,
          },
        });

        const student = await prisma.student.create({
          data: {
            userId: user.id,
            name,
            phone,
          },
        });

        return { user, student };
      });

      return {
        id: result.student.id,
        name: result.student.name,
        phone: result.student.phone,
        email: result.user.email,
        createdAt: result.user.createdAt,
      };
    } catch (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }
  }

  /**
   * Update student information
   * @param {number} studentId - Student ID
   * @param {Object} updateData - Update data
   * @param {string} updateData.name - Student name
   * @param {string} updateData.phone - Student phone
   * @param {boolean} updateData.isVerified - User verification status
   * @returns {Promise<Object>} Updated student
   */
  async updateStudent(studentId, { name, phone, isVerified }) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { user: true },
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Update student and user in a transaction
      const result = await prisma.$transaction(async (prisma) => {
        const updatedStudent = await prisma.student.update({
          where: { id: studentId },
          data: { name, phone },
          include: { user: true },
        });

        if (isVerified !== undefined) {
          await prisma.user.update({
            where: { id: student.userId },
            data: { isVerified },
          });
        }

        return updatedStudent;
      });

      return {
        id: result.id,
        name: result.name,
        phone: result.phone,
        email: result.user.email,
        isVerified: isVerified !== undefined ? isVerified : result.user.isVerified,
      };
    } catch (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  }

  /**
   * Delete student and associated data
   * @param {number} studentId - Student ID
   * @returns {Promise<void>}
   */
  async deleteStudent(studentId) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Delete student and associated data in a transaction
      await prisma.$transaction(async (prisma) => {
        // Delete enrollments
        await prisma.enrollment.deleteMany({
          where: { studentId },
        });

        // Delete wishlists
        await prisma.wishlist.deleteMany({
          where: { studentId },
        });

        // Delete student
        await prisma.student.delete({
          where: { id: studentId },
        });

        // Delete associated user
        await prisma.user.delete({
          where: { id: student.userId },
        });
      });
    } catch (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }

  /**
   * Check if student exists
   * @param {number} studentId - Student ID
   * @returns {Promise<boolean>} Whether student exists
   */
  async studentExists(studentId) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
      return !!student;
    } catch (error) {
      throw new Error(`Failed to check student existence: ${error.message}`);
    }
  }

  /**
   * Get student enrollments
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} Student enrollments
   */
  async getStudentEnrollments(userId) {
    try {
      // First find the student record associated with this user
      const student = await prisma.student.findFirst({
        where: {
          userId: Number(userId)
        },
        select: {
          id: true // We only need the student ID
        }
      });

      // Now get the enrollments with all relations
      const studentWithEnrollments = await prisma.student.findUnique({
        where: { id: student.id },
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  instructor: {
                    select: {
                      name: true,
                    },
                  },
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return studentWithEnrollments.enrollments;
    } catch (error) {
      return [];
    }
  }
  /**
   * Get student wishlist
   * @param {number} studentId - Student ID
   * @returns {Promise<Array>} Student wishlist
   */
  async getStudentWishlist(studentId) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          wishlists: {
            include: {
              course: {
                include: {
                  instructor: {
                    select: {
                      name: true,
                    },
                  },
                  category: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new Error('Student not found');
      }

      return student.wishlists;
    } catch (error) {
      throw new Error(`Failed to fetch student wishlist: ${error.message}`);
    }
  }
}

module.exports = new StudentService();