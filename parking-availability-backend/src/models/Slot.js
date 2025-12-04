const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: [true, 'Please provide a slot number'],
    trim: true
  },
  parkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLot',
    required: true
  },
  type: {
    type: String,
    enum: ['regular', 'covered', 'evCharging', 'handicap'],
    default: 'regular',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  location: {
    floor: { type: String, default: 'Ground' },
    section: { type: String },
    coordinates: {
      x: { type: Number },
      y: { type: Number }
    }
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  sensorId: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
slotSchema.index({ parkingLot: 1, status: 1 });
slotSchema.index({ parkingLot: 1, type: 1, status: 1 });

module.exports = mongoose.model('Slot', slotSchema);

