const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a parking lot name'],
    trim: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please provide coordinates'],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && // longitude
                 v[1] >= -90 && v[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates'
      }
    }
  },
  totalSlots: {
    type: Number,
    required: [true, 'Please provide total number of slots'],
    min: 1
  },
  availableSlots: {
    type: Number,
    default: 0
  },
  occupiedSlots: {
    type: Number,
    default: 0
  },
  pricing: {
    baseRate: { type: Number, required: true, min: 0 },
    hourlyRate: { type: Number, required: true, min: 0 },
    dailyRate: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' }
  },
  operatingHours: {
    open: { type: String, default: '00:00' },
    close: { type: String, default: '23:59' }
  },
  features: {
    covered: { type: Boolean, default: false },
    evCharging: { type: Boolean, default: false },
    handicapAccessible: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false }
  },
  slotTypes: {
    regular: { type: Number, default: 0 },
    covered: { type: Number, default: 0 },
    evCharging: { type: Number, default: 0 },
    handicap: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
parkingLotSchema.index({ location: '2dsphere' });

// Update available slots when slots are created/updated
parkingLotSchema.methods.updateSlotCounts = async function() {
  const Slot = mongoose.model('Slot');
  const totalSlots = await Slot.countDocuments({ parkingLot: this._id });
  const availableSlots = await Slot.countDocuments({ 
    parkingLot: this._id, 
    status: 'available' 
  });
  const occupiedSlots = await Slot.countDocuments({ 
    parkingLot: this._id, 
    status: { $in: ['occupied', 'reserved'] } 
  });
  
  this.totalSlots = totalSlots;
  this.availableSlots = availableSlots;
  this.occupiedSlots = occupiedSlots;
  await this.save();
};

module.exports = mongoose.model('ParkingLot', parkingLotSchema);

