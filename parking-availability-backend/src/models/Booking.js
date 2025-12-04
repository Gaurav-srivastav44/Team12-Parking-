const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parkingLot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingLot',
    required: true
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  bookingType: {
    type: String,
    enum: ['instant', 'reservation'],
    default: 'instant'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  reservedUntil: {
    type: Date
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  pricing: {
    baseRate: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet'],
      default: 'cash'
    },
    transactionId: {
      type: String
    },
    paidAt: {
      type: Date
    }
  },
  notes: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
bookingSchema.index({ driver: 1, status: 1 });
bookingSchema.index({ parkingLot: 1, status: 1 });
bookingSchema.index({ slot: 1, status: 1 });
bookingSchema.index({ status: 1, startTime: 1 });

// Calculate total amount before saving
bookingSchema.pre('save', function(next) {
  if (this.duration && this.pricing.hourlyRate) {
    const hours = Math.ceil(this.duration / 60);
    this.pricing.totalAmount = this.pricing.baseRate + (hours * this.pricing.hourlyRate);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

