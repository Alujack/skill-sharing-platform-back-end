const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/admin.dashboard.controller');

router.get(
    '/counts',
    adminDashboardController.getDashboardCounts
);

module.exports = router;