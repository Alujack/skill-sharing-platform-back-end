const { instructor } = require('../prisma');
const courseService = require('../services/course.service');

exports.getAllCourses = async (req, res) => {
  try {
    const { search, categoryId, isApproved, instructorId } = req.query;

    // Construct filters object
    const filters = {
      categoryId,
      isApproved,
      instructorId,
    };

    const courses = await courseService.getAllCourses(search, filters);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get course', details: err.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await courseService.getInstructorCourses(parseInt(req.params.id));
    if (!courses) return res.status(404).json({ message: 'Instructor not found' });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructor courses', details: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.categoryId,
      instructorId: req.body.instructorId
    };

    const course = await courseService.createCourse(req.body.instructorId, data);
    if (!course) return res.status(403).json({ message: 'Not an instructor' });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      categoryId: req.body.category_id,
    };

    const result = await courseService.updateCourse(courseId, data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course', details: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const success = await courseService.deleteCourse(courseId);

    if (!success) return res.status(403).json({ message: 'Not your course' });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
};
