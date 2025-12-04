const Booking = require('../models/Booking');
const ParkingLot = require('../models/ParkingLot');
const Slot = require('../models/Slot');
const User = require('../models/User');

// @desc    Get driver dashboard stats
// @route   GET /api/dashboard/driver
// @access  Private (Driver)
exports.getDriverDashboard = async (req, res, next) => {
  try {
    const activeBookings = await Booking.countDocuments({
      driver: req.user._id,
      status: { $in: ['pending', 'confirmed', 'active'] }
    });

    const totalBookings = await Booking.countDocuments({
      driver: req.user._id
    });

    const recentBookings = await Booking.find({
      driver: req.user._id
    })
      .populate('parkingLot', 'name address')
      .populate('slot', 'slotNumber type')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          activeBookings,
          totalBookings
        },
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
exports.getManagerDashboard = async (req, res, next) => {
  try {
    const { parkingLotId } = req.query;

    // Get parking lots managed by user
    let parkingLots;
    if (parkingLotId) {
      const parkingLot = await ParkingLot.findById(parkingLotId);
      if (!parkingLot || parkingLot.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this parking lot'
        });
      }
      parkingLots = [parkingLot];
    } else {
      parkingLots = await ParkingLot.find({ manager: req.user._id });
    }

    const parkingLotIds = parkingLots.map(pl => pl._id);

    // Get stats
    const totalSlots = await Slot.countDocuments({
      parkingLot: { $in: parkingLotIds }
    });

    const availableSlots = await Slot.countDocuments({
      parkingLot: { $in: parkingLotIds },
      status: 'available'
    });

    const occupiedSlots = await Slot.countDocuments({
      parkingLot: { $in: parkingLotIds },
      status: { $in: ['occupied', 'reserved'] }
    });

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      parkingLot: { $in: parkingLotIds },
      createdAt: { $gte: today }
    });

    // Get revenue (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentBookings = await Booking.find({
      parkingLot: { $in: parkingLotIds },
      createdAt: { $gte: last30Days },
      status: 'completed',
      'payment.status': 'completed'
    });

    const revenue = recentBookings.reduce((sum, booking) => {
      return sum + (booking.pricing.totalAmount || 0);
    }, 0);

    // Get peak hours (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const bookingsLast7Days = await Booking.find({
      parkingLot: { $in: parkingLotIds },
      createdAt: { $gte: last7Days }
    });

    const hourlyStats = {};
    bookingsLast7Days.forEach(booking => {
      const hour = new Date(booking.createdAt).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourlyStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalParkingLots: parkingLots.length,
          totalSlots,
          availableSlots,
          occupiedSlots,
          occupancyRate: totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(2) : 0,
          todayBookings,
          revenue30Days: revenue,
          peakHours
        },
        parkingLots: parkingLots.map(pl => ({
          id: pl._id,
          name: pl.name,
          totalSlots: pl.totalSlots,
          availableSlots: pl.availableSlots,
          occupiedSlots: pl.occupiedSlots
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const totalManagers = await User.countDocuments({ role: 'manager' });
    const totalParkingLots = await ParkingLot.countDocuments();
    const totalSlots = await Slot.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const activeBookings = await Booking.countDocuments({
      status: { $in: ['pending', 'confirmed', 'active'] }
    });

    // Get revenue (last 30 days)
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentBookings = await Booking.find({
      createdAt: { $gte: last30Days },
      status: 'completed',
      'payment.status': 'completed'
    });

    const revenue = recentBookings.reduce((sum, booking) => {
      return sum + (booking.pricing.totalAmount || 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDrivers,
          totalManagers,
          totalParkingLots,
          totalSlots,
          totalBookings,
          activeBookings,
          revenue30Days: revenue
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

