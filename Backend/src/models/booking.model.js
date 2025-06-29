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
    jobApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
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
        "technician",
        "mechanic",
        "home-cleaner",
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
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (val) =>
            Array.isArray(val) &&
            val.length === 2 &&
            val.every((num) => typeof num === "number"),
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
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
    feedback: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    workerEarning: {
      type: Number,
      default: 0, // In ₹
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Geo index for location-based queries
bookingSchema.index({ location: '2dsphere' });

// Automatically set completedAt when booking is marked as completed
bookingSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export const Booking = mongoose.model('Booking', bookingSchema);
