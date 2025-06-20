const {
  getWishlistByStudentId,
  addCourseToWishlist,
  removeWishlistItem,
  clearStudentWishlist
} = require('../services/whishlist.service');

exports.getWishlist = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("student =", studentId)
    const wishlist = await getWishlistByStudentId(studentId);
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const item = await addCourseToWishlist(studentId, courseId);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await removeWishlistItem(id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.clearWishlist = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await clearStudentWishlist(studentId);
    res.json({ message: `Cleared ${result.count} items from wishlist` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};