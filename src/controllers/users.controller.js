const prisma = require('../prisma');

exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const updated = await prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { name, email, role },
  });
  res.json(updated);
};

exports.deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        instructor: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user (this will cascade to student/instructor records)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.createInstructorProfile = async (req, res) => {
  const { bio } = req.body;
  const userId = parseInt(req.params.id);
  console.log("user id ==", userId)
  console.log("bio ==", bio)

  const exists = await prisma.instructorProfile.findUnique({ where: { userId } });
  if (exists) return res.status(400).json({ message: 'Profile already exists' });

  const profile = await prisma.instructorProfile.create({
    data: { userId, bio },
  });
  res.json(profile);
};

exports.updateInstructorProfile = async (req, res) => {
  const { bio } = req.body;
  const userId = parseInt(req.params.id);

  const updated = await prisma.instructorProfile.update({
    where: { userId },
    data: { bio },
  });
  res.json(updated);
};
