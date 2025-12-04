const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Minimal booking routes (3 endpoints total)
router.post('/', authorize('driver', 'admin'), createBooking); // Create booking
router.get('/', getBookings);                                  // List current user bookings
router.put('/:id', updateBooking);                             // Update booking (start/end/cancel)

module.exports = router;

