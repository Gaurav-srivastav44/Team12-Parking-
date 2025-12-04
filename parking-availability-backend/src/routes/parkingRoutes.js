const express = require('express');
const router = express.Router();
const {
  createParkingLot,
  getParkingLots,
  getParkingLot
} = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/auth');

// Minimal public routes (3 endpoints total)
router.get('/', getParkingLots);      // List parking lots
router.get('/:id', getParkingLot);    // Get single parking lot
router.post('/', protect, authorize('manager', 'admin'), createParkingLot); // Create parking lot

module.exports = router;

