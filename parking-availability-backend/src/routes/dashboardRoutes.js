const express = require('express');
const router = express.Router();
const {
  getDriverDashboard,
  getManagerDashboard,
  getAdminDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/driver', authorize('driver', 'admin'), getDriverDashboard);
router.get('/manager', authorize('manager', 'admin'), getManagerDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

module.exports = router;

