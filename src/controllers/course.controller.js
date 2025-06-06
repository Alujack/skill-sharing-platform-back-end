const prisma = require('../prisma');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { category: true, instructor: { include: { user: true } } },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description, price, category_id } = req.body;
  const userId = req.user.id;

  try {
    const instructor = await prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!instructor) return res.status(403).json({ message: 'Not an instructor' });

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        categoryId: category_id,
        instructorId: instructor.id,
      },
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true,
        instructor: { include: { user: true } },
        lessons: true,
      },
    });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get course', details: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const { title, description, price, category_id } = req.body;
  const userId = req.user.id;

  try {
    const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });

    if (!instructor) return res.status(403).json({ message: 'Not an instructor' });

    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course || course.instructorId !== instructor.id)
      return res.status(403).json({ message: 'Not your course' });

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: { title, description, price, categoryId: category_id },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course', details: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });

    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course || course.instructorId !== instructor?.id)
      return res.status(403).json({ message: 'Not your course' });

    await prisma.course.delete({ where: { id: courseId } });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const instructor = await prisma.instructorProfile.findUnique({ where: { userId } });
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    const courses = await prisma.course.findMany({
      where: { instructorId: instructor.id },
      include: { category: true },
    });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructor courses', details: err.message });
  }
};
