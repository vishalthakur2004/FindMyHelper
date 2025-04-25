import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceCategory: {
    type: String,
    required: true,
    enum: ['plumber', 'electrician', 'carpenter', 'painter'],
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested',
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  scheduledDate: {
    type: Date,
    required: true,
  },  
  completedAt: Date,
  amount: Number,
  paymentMethod: {
    type: String,
    enum: ['upi', 'cash'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  workerEarning: {
    type: Number,
    default: 0, // In ₹
  },
}, {
  timestamps: true,
});

bookingSchema.index({ location: '2dsphere' });

export const Booking = mongoose.model('Booking', bookingSchema);
