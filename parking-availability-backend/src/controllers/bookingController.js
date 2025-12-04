const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const ParkingLot = require('../models/ParkingLot');
const Notification = require('../models/Notification');
const { AppError } = require('../utils/errorHandler');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Driver)
exports.createBooking = async (req, res, next) => {
  try {
    const { parkingLotId, slotId, vehicleNumber, bookingType, startTime, reservedUntil } = req.body;

    // Validation
    if (!parkingLotId || !slotId || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide parking lot, slot, and vehicle number'
      });
    }

    // Check if slot exists and is available
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    if (slot.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Slot is not available'
      });
    }

    // Check if slot belongs to the parking lot
    if (slot.parkingLot.toString() !== parkingLotId) {
      return res.status(400).json({
        success: false,
        message: 'Slot does not belong to this parking lot'
      });
    }

    // Get parking lot for pricing
    const parkingLot = await ParkingLot.findById(parkingLotId);
    if (!parkingLot) {
      return res.status(404).json({
        success: false,
        message: 'Parking lot not found'
      });
    }

    // Create booking
    const booking = await Booking.create({
      driver: req.user._id,
      parkingLot: parkingLotId,
      slot: slotId,
      vehicleNumber,
      bookingType: bookingType || 'instant',
      startTime: startTime ? new Date(startTime) : new Date(),
      reservedUntil: reservedUntil ? new Date(reservedUntil) : null,
      pricing: {
        baseRate: parkingLot.pricing.baseRate,
        hourlyRate: parkingLot.pricing.hourlyRate,
        currency: parkingLot.pricing.currency
      },
      status: bookingType === 'reservation' ? 'confirmed' : 'pending'
    });

    // Update slot status
    slot.status = bookingType === 'reservation' ? 'reserved' : 'occupied';
    slot.currentBooking = booking._id;
    slot.lastUpdated = Date.now();
    await slot.save();

    // Update parking lot slot counts
    await parkingLot.updateSlotCounts();

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: `Your booking for slot ${slot.slotNumber} at ${parkingLot.name} has been confirmed.`,
      relatedBooking: booking._id,
      relatedParkingLot: parkingLotId
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { driver: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('parkingLot', 'name address location')
      .populate('slot', 'slotNumber type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('driver', 'name email phone')
      .populate('parkingLot', 'name address location pricing')
      .populate('slot', 'slotNumber type location');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.driver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking (start, end, cancel)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const { action, endTime } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const slot = await Slot.findById(booking.slot);
    const parkingLot = await ParkingLot.findById(booking.parkingLot);

    switch (action) {
      case 'start':
        if (booking.status !== 'confirmed' && booking.status !== 'pending') {
          return res.status(400).json({
            success: false,
            message: 'Cannot start this booking'
          });
        }
        booking.status = 'active';
        booking.actualStartTime = new Date();
        slot.status = 'occupied';
        break;

      case 'end':
        if (booking.status !== 'active') {
          return res.status(400).json({
            success: false,
            message: 'Booking is not active'
          });
        }
        booking.status = 'completed';
        booking.actualEndTime = endTime ? new Date(endTime) : new Date();
        booking.duration = Math.ceil(
          (booking.actualEndTime - booking.actualStartTime) / (1000 * 60)
        );
        slot.status = 'available';
        slot.currentBooking = null;
        break;

      case 'cancel':
        if (['completed', 'cancelled'].includes(booking.status)) {
          return res.status(400).json({
            success: false,
            message: 'Cannot cancel this booking'
          });
        }
        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        booking.cancellationReason = req.body.reason || 'User cancelled';
        slot.status = 'available';
        slot.currentBooking = null;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await booking.save();
    await slot.save();
    await parkingLot.updateSlotCounts();

    // Create notification
    const notificationType = action === 'end' ? 'booking_completed' : 
                            action === 'cancel' ? 'booking_cancelled' : 'booking_started';
    await Notification.create({
      user: booking.driver,
      type: notificationType,
      title: `Booking ${action === 'end' ? 'Completed' : action === 'cancel' ? 'Cancelled' : 'Started'}`,
      message: `Your booking at ${parkingLot.name} has been ${action === 'end' ? 'completed' : action === 'cancel' ? 'cancelled' : 'started'}.`,
      relatedBooking: booking._id,
      relatedParkingLot: booking.parkingLot
    });

    res.status(200).json({
      success: true,
      message: `Booking ${action}ed successfully`,
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get parking lot bookings
// @route   GET /api/parking/:id/bookings
// @access  Private (Manager/Admin)
exports.getParkingLotBookings = async (req, res, next) => {
  try {
    const parkingLot = await ParkingLot.findById(req.params.id);

    if (!parkingLot) {
      return res.status(404).json({
        success: false,
        message: 'Parking lot not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && parkingLot.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bookings for this parking lot'
      });
    }

    const { status, startDate, endDate } = req.query;
    const query = { parkingLot: req.params.id };

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('driver', 'name email phone vehicleNumber')
      .populate('slot', 'slotNumber type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

