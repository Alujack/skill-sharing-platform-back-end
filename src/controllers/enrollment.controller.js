const prisma = require('../prisma');

exports.enrollInCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  const newuser = Number(userId)
  const newcourse = Number(courseId);

  if (!courseId || !userId) {
    return res.status(400).json({ message: 'Missing courseId or userId' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: newuser },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let student = await prisma.student.findUnique({
      where: { userId: newuser },
    });

    if (!student) {
      student = await prisma.student.create({
        data: {
          userId: newuser,
        },
      });

      await prisma.user.update({
        where: { id: newuser },
        data: { role: "Student" },
      });
      console.log(`User ${userId} role updated to STUDENT.`);
    }
    const studentId = student.id;
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: newcourse,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // 5. Create the enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        studentId: studentId,
        courseId: newcourse,
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        course: true,
      }
    });

    res.status(201).json(newEnrollment);

  } catch (err) {
    console.error('Failed to enroll:', err);
    res.status(500).json({ error: 'Failed to enroll', details: err.message });
  }
};

// Also update getUserEnrollments to include user details if needed for student info
exports.getUserEnrollments = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const student = await prisma.student.findUnique({
      where: { userId: userId },
      include: { user: true } // Include the related User data
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found for this user.' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: { course: true },
    });

    // You can now access student.user.name if needed
    res.json(enrollments);
  } catch (err) {
    console.error('Failed to fetch user enrollments:', err);
    res.status(500).json({ error: 'Failed to fetch user enrollments', details: err.message });
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

exports.getCourseEnrollments = async (req, res) => {
  const courseId = parseInt(req.params.id);
  console.log("Fetching course and enrolled students for courseId ==", courseId);

  try {
    // 1. Fetch the Course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Fetch all enrollments for that course, including student and user details
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: courseId },
      include: {
        student: {
          include: {
            user: true // Include the user details nested within the student
          }
        },
      },
    });

    // 3. Extract unique student objects from the enrollments
    const enrolledStudents = [];
    const studentIds = new Set(); // To ensure each student is added only once

    for (const enrollment of enrollments) {
      if (enrollment.student && !studentIds.has(enrollment.student.id)) {
        enrolledStudents.push(enrollment.student);
        studentIds.add(enrollment.student.id);
      }
    }

    // 4. Construct the desired response object
    const responseData = {
      course: course,
      students: enrolledStudents,
    };

    res.json(responseData); // Send back the structured object

  } catch (err) {
    console.error('Failed to fetch course details and enrolled students:', err);
    res.status(500).json({ error: 'Failed to fetch course details and enrolled students', details: err.message });
  }
};
