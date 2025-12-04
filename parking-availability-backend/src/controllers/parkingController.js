const ParkingLot = require('../models/ParkingLot');
const Slot = require('../models/Slot');
const { AppError } = require('../utils/errorHandler');

// @desc    Create parking lot
// @route   POST /api/parking
// @access  Private (Manager/Admin)
exports.createParkingLot = async (req, res, next) => {
  try {
    const parkingLotData = {
      ...req.body,
      manager: req.user.role === 'admin' ? (req.body.manager || req.user._id) : req.user._id
    };

    // Convert latitude/longitude to GeoJSON format if provided separately
    if (req.body.latitude && req.body.longitude && !req.body.location) {
      parkingLotData.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      };
    }

    const parkingLot = await ParkingLot.create(parkingLotData);

    // Update user's parking lots
    const User = require('../models/User');
    await User.findByIdAndUpdate(parkingLot.manager, {
      $push: { parkingLots: parkingLot._id }
    });

    res.status(201).json({
      success: true,
      message: 'Parking lot created successfully',
      data: { parkingLot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all parking lots
// @route   GET /api/parking
// @access  Public
exports.getParkingLots = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000, type, minPrice, maxPrice } = req.query;
    
    let query = { isActive: true };

    // Location-based search
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    // Filter by type
    if (type) {
      query[`features.${type}`] = true;
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query['pricing.hourlyRate'] = {};
      if (minPrice) query['pricing.hourlyRate'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.hourlyRate'].$lte = parseFloat(maxPrice);
    }

    const parkingLots = await ParkingLot.find(query)
      .populate('manager', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: parkingLots.length,
      data: { parkingLots }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single parking lot
// @route   GET /api/parking/:id
// @access  Public
exports.getParkingLot = async (req, res, next) => {
  try {
    const parkingLot = await ParkingLot.findById(req.params.id)
      .populate('manager', 'name email phone');

    if (!parkingLot) {
      return res.status(404).json({
        success: false,
        message: 'Parking lot not found'
      });
    }

    // Get available slots
    const availableSlots = await Slot.find({
      parkingLot: parkingLot._id,
      status: 'available'
    });

    res.status(200).json({
      success: true,
      data: {
        parkingLot,
        availableSlots: availableSlots.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update parking lot
// @route   PUT /api/parking/:id
// @access  Private (Manager/Admin)
exports.updateParkingLot = async (req, res, next) => {
  try {
    let parkingLot = await ParkingLot.findById(req.params.id);

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
        message: 'Not authorized to update this parking lot'
      });
    }

    parkingLot = await ParkingLot.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Parking lot updated successfully',
      data: { parkingLot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete parking lot
// @route   DELETE /api/parking/:id
// @access  Private (Manager/Admin)
exports.deleteParkingLot = async (req, res, next) => {
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
        message: 'Not authorized to delete this parking lot'
      });
    }

    await parkingLot.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Parking lot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create slot
// @route   POST /api/parking/:id/slots
// @access  Private (Manager/Admin)
exports.createSlot = async (req, res, next) => {
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
        message: 'Not authorized to create slots for this parking lot'
      });
    }

    const slot = await Slot.create({
      ...req.body,
      parkingLot: parkingLot._id
    });

    // Update parking lot slot counts
    await parkingLot.updateSlotCounts();

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get slots for parking lot
// @route   GET /api/parking/:id/slots
// @access  Public
exports.getSlots = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const query = { parkingLot: req.params.id };

    if (type) query.type = type;
    if (status) query.status = status;

    const slots = await Slot.find(query).populate('currentBooking');

    res.status(200).json({
      success: true,
      count: slots.length,
      data: { slots }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update slot status
// @route   PUT /api/parking/:id/slots/:slotId
// @access  Private (Manager/Admin)
exports.updateSlot = async (req, res, next) => {
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
        message: 'Not authorized to update slots for this parking lot'
      });
    }

    const slot = await Slot.findByIdAndUpdate(
      req.params.slotId,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    // Update parking lot slot counts
    await parkingLot.updateSlotCounts();

    res.status(200).json({
      success: true,
      message: 'Slot updated successfully',
      data: { slot }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots
// @route   GET /api/parking/:id/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = {
      parkingLot: req.params.id,
      status: 'available'
    };

    if (type) query.type = type;

    const slots = await Slot.find(query);

    res.status(200).json({
      success: true,
      count: slots.length,
      data: { slots }
    });
  } catch (error) {
    next(error);
  }
};

