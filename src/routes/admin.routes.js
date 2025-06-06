const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');

router.use(auth, authorizeRoles('Admin'));

router.get('/stats', adminController.getPlatformStats);
router.put('/approve-instructor/:userId', adminController.approveInstructor);

module.exports = router;