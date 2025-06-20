import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCategory: {
      type: String,
      required: true,
      enum: [
        "plumber",
        "electrician",
        "carpenter",
        "painter",
        "mason",
        "ac-technician",
        "appliance-repair",
        "pest-control",
        "gardener",
        "cleaner",
      ],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "in-progress",
        "completed",
        "cancelled",
        "confirmed",
      ],
      default: "pending",
    },
    location: {
      type: {
        type: String,
        default: "Point",
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
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "cash", "online"],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    feedback: String,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    workerEarning: {
      type: Number,
      default: 0, // In ₹
    },
  },
  {
  timestamps: true,
  },
);

bookingSchema.index({ location: '2dsphere' });

export const Booking = mongoose.model('Booking', bookingSchema);
