const prisma = require('../prisma');

exports.enrollInCourse = async (req, res) => {
  const userId = req.user.id;
  const { course_id } = req.body;

  try {
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course_id } },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId: course_id },
    });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll', details: err.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: true,
        student: true,
      },
    });

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollment', details: err.message });
  }
};

exports.getUserEnrollments = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user enrollments', details: err.message });
  }
};

exports.getCourseEnrollments = async (req, res) => {
  const courseId = parseInt(req.params.id);

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: { user: true },
    });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course enrollments', details: err.message });
  }
};
