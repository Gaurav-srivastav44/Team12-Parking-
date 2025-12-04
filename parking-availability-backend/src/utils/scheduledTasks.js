const cron = require('node-cron');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const ParkingLot = require('../models/ParkingLot');
const Notification = require('../models/Notification');

// Run every minute to check for expired reservations
const checkExpiredReservations = async (io) => {
  try {
    const now = new Date();
    
    // Find expired reservations
    const expiredReservations = await Booking.find({
      status: 'confirmed',
      bookingType: 'reservation',
      reservedUntil: { $lt: now }
    }).populate('slot parkingLot driver');

    for (const booking of expiredReservations) {
      // Update booking status
      booking.status = 'expired';
      await booking.save();

      // Free up the slot
      const slot = await Slot.findById(booking.slot._id);
      if (slot) {
        slot.status = 'available';
        slot.currentBooking = null;
        slot.lastUpdated = new Date();
        await slot.save();
      }

      // Update parking lot counts
      const parkingLot = await ParkingLot.findById(booking.parkingLot._id);
      if (parkingLot) {
        await parkingLot.updateSlotCounts();
      }

      // Create notification
      await Notification.create({
        user: booking.driver._id,
        type: 'reservation_expired',
        title: 'Reservation Expired',
        message: `Your reservation for slot ${slot?.slotNumber} at ${parkingLot?.name} has expired.`,
        relatedBooking: booking._id,
        relatedParkingLot: booking.parkingLot._id
      });

      // Emit socket event
      if (io) {
        io.to(`user-${booking.driver._id}`).emit('booking-updated', {
          bookingId: booking._id,
          status: 'expired'
        });
        io.to(`parking-lot-${booking.parkingLot._id}`).emit('slot-updated', {
          slotId: slot?._id,
          status: 'available',
          parkingLotId: booking.parkingLot._id
        });
      }
    }

    if (expiredReservations.length > 0) {
      console.log(`Processed ${expiredReservations.length} expired reservations`);
    }
  } catch (error) {
    console.error('Error checking expired reservations:', error);
  }
};

// Run every 5 minutes to send reservation expiry reminders
const sendReservationReminders = async (io) => {
  try {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes from now

    const upcomingExpirations = await Booking.find({
      status: 'confirmed',
      bookingType: 'reservation',
      reservedUntil: {
        $gte: now,
        $lte: reminderTime
      }
    }).populate('slot parkingLot driver');

    for (const booking of upcomingExpirations) {
      // Check if reminder already sent (you might want to add a flag to track this)
      const existingNotification = await Notification.findOne({
        user: booking.driver._id,
        relatedBooking: booking._id,
        type: 'reservation_expiring',
        createdAt: { $gte: new Date(now.getTime() - 5 * 60 * 1000) } // Within last 5 minutes
      });

      if (!existingNotification) {
        // Create reminder notification
        await Notification.create({
          user: booking.driver._id,
          type: 'reservation_expiring',
          title: 'Reservation Expiring Soon',
          message: `Your reservation for slot ${booking.slot.slotNumber} at ${booking.parkingLot.name} expires in 15 minutes.`,
          relatedBooking: booking._id,
          relatedParkingLot: booking.parkingLot._id
        });

        // Emit socket event
        if (io) {
          io.to(`user-${booking.driver._id}`).emit('notification', {
            type: 'reservation_expiring',
            title: 'Reservation Expiring Soon',
            message: `Your reservation expires in 15 minutes.`
          });
        }
      }
    }
  } catch (error) {
    console.error('Error sending reservation reminders:', error);
  }
};

// Initialize scheduled tasks
const initializeScheduledTasks = (io) => {
  // Check for expired reservations every minute
  cron.schedule('* * * * *', () => {
    checkExpiredReservations(io);
  });

  // Send reservation reminders every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    sendReservationReminders(io);
  });

  console.log('Scheduled tasks initialized');
};

module.exports = {
  initializeScheduledTasks,
  checkExpiredReservations,
  sendReservationReminders
};

