const Slot = require('../models/Slot');
const ParkingLot = require('../models/ParkingLot');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// Socket.io connection handler
const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join parking lot room for real-time updates
    socket.on('join-parking-lot', async (parkingLotId) => {
      socket.join(`parking-lot-${parkingLotId}`);
      console.log(`Socket ${socket.id} joined parking-lot-${parkingLotId}`);
      
      // Send current availability
      try {
        const parkingLot = await ParkingLot.findById(parkingLotId);
        const availableSlots = await Slot.countDocuments({
          parkingLot: parkingLotId,
          status: 'available'
        });
        const occupiedSlots = await Slot.countDocuments({
          parkingLot: parkingLotId,
          status: { $in: ['occupied', 'reserved'] }
        });

        socket.emit('parking-lot-status', {
          parkingLotId,
          availableSlots,
          occupiedSlots,
          totalSlots: parkingLot?.totalSlots || 0
        });
      } catch (error) {
        console.error('Error fetching parking lot status:', error);
      }
    });

    // Leave parking lot room
    socket.on('leave-parking-lot', (parkingLotId) => {
      socket.leave(`parking-lot-${parkingLotId}`);
      console.log(`Socket ${socket.id} left parking-lot-${parkingLotId}`);
    });

    // Join user room for notifications
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined user-${userId}`);
    });

    // Leave user room
    socket.on('leave-user', (userId) => {
      socket.leave(`user-${userId}`);
      console.log(`Socket ${socket.id} left user-${userId}`);
    });

    // Handle slot status update (from manager/IoT)
    socket.on('update-slot-status', async (data) => {
      try {
        const { slotId, status, parkingLotId } = data;
        
        const slot = await Slot.findByIdAndUpdate(
          slotId,
          { status, lastUpdated: new Date() },
          { new: true }
        );

        if (!slot) {
          socket.emit('error', { message: 'Slot not found' });
          return;
        }

        // Update parking lot counts
        const parkingLot = await ParkingLot.findById(parkingLotId || slot.parkingLot);
        if (parkingLot) {
          await parkingLot.updateSlotCounts();
        }

        // Broadcast to all users in the parking lot room
        io.to(`parking-lot-${parkingLotId || slot.parkingLot}`).emit('slot-updated', {
          slotId: slot._id,
          status: slot.status,
          parkingLotId: parkingLotId || slot.parkingLot,
          availableSlots: parkingLot?.availableSlots || 0,
          occupiedSlots: parkingLot?.occupiedSlots || 0
        });
      } catch (error) {
        console.error('Error updating slot status:', error);
        socket.emit('error', { message: 'Failed to update slot status' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Helper function to emit slot updates
const emitSlotUpdate = (io, parkingLotId, slotId, status) => {
  io.to(`parking-lot-${parkingLotId}`).emit('slot-updated', {
    slotId,
    status,
    parkingLotId,
    timestamp: new Date()
  });
};

// Helper function to emit notification
const emitNotification = (io, userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

// Helper function to emit booking update
const emitBookingUpdate = (io, booking) => {
  // Emit to user
  io.to(`user-${booking.driver}`).emit('booking-updated', booking);
  // Emit to parking lot room
  io.to(`parking-lot-${booking.parkingLot}`).emit('booking-updated', booking);
};

module.exports = {
  setupSocket,
  emitSlotUpdate,
  emitNotification,
  emitBookingUpdate
};

