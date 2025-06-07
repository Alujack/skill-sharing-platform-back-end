const prisma = require('../prisma');

/**
 * @desc Get all students
 * @route GET /api/students
 * @access Private (User role)
 */
const getAllStudents = async (req, res) => {
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

    const formatted = students.map((student) => ({
      id: student.id,
      name: student.name,
      phone: student.phone,
      email: student.user.email,
      isVerified: student.user.isVerified,
      createdAt: student.user.createdAt,
      enrollments: student.enrollments,
    }));

    res.status(200).json({
      success: true,
      count: students.length,
      data: formatted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Get single student
 * @route GET /api/students/:id
 * @access Private (User role)
 */
const getStudent = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(req.params.id),
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
                    user: {
                      select: {
                        name: true,
                      },
                    },
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
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: student.id,
        name: student.name,
        phone: student.phone,
        email: student.user.email,
        isVerified: student.user.isVerified,
        createdAt: student.user.createdAt,
        enrollments: student.enrollments,
        wishlists: student.wishlists,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Create a student
 * @route POST /api/students
 * @access Private (User role)
 */
const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password, // Hashing recommended in production
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

    res.status(201).json({
      success: true,
      data: {
        id: student.id,
        name: student.name,
        phone: student.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Update student
 * @route PUT /api/students/:id
 * @access Private (User role)
 */
const updateStudent = async (req, res) => {
  try {
    const { name, phone, isVerified } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true },
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: { name, phone },
      include: {
        user: true,
      },
    });

    await prisma.user.update({
      where: { id: student.userId },
      data: { isVerified },
    });

    res.status(200).json({
      success: true,
      data: {
        id: updatedStudent.id,
        name: updatedStudent.name,
        phone: updatedStudent.phone,
        email: updatedStudent.user.email,
        isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * @desc Delete student
 * @route DELETE /api/students/:id
 * @access Private (User role)
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    await prisma.enrollment.deleteMany({
      where: { studentId: student.id },
    });

    await prisma.wishlist.deleteMany({
      where: { studentId: student.id },
    });

    await prisma.student.delete({
      where: { id: student.id },
    });

    await prisma.user.delete({
      where: { id: student.userId },
    });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
