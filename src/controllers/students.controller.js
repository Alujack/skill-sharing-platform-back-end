const prisma = require('../prisma');

/**
 * @desc Get all students
 * @route GET /api/students
 * @access Private (User role)
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'Student'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        enrollments: {
          select: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
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
    const student = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
        role: 'Student'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
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
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        wishlists: {
          select: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const student = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, you should hash the password first
        role: 'Student',
        phone,
        isVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      data: student
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

    // Check if student exists
    const existingStudent = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
        role: 'Student'
      }
    });

    if (!existingStudent) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const updatedStudent = await prisma.user.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        name,
        phone,
        isVerified
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: updatedStudent
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
    // Check if student exists
    const existingStudent = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
        role: 'Student'
      }
    });

    if (!existingStudent) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // First delete related records (enrollments and wishlists)
    await prisma.enrollment.deleteMany({
      where: { userId: parseInt(req.params.id) }
    });

    await prisma.wishlist.deleteMany({
      where: { userId: parseInt(req.params.id) }
    });

    // Then delete the student
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
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
  deleteStudent
};