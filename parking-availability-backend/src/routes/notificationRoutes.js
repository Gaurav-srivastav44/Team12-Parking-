const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Minimal notification routes (3 endpoints total)
router.get('/', getNotifications);           // List notifications
router.put('/:id/read', markAsRead);        // Mark one notification as read
router.delete('/:id', deleteNotification);  // Delete one notification

module.exports = router;

