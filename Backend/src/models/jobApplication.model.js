import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    proposedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["applied", "accepted", "rejected", "confirmed"], // confirmed means both parties agreed
      default: "applied",
    },
    // Workflow tracking
    customerConfirmed: {
      type: Boolean,
      default: false,
    },
    workerConfirmed: {
      type: Boolean,
      default: false,
    },
    customerConfirmedAt: {
      type: Date,
    },
    workerConfirmedAt: {
      type: Date,
    },
    // Auto-conversion to booking
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    convertedToBooking: {
      type: Boolean,
      default: false,
    },
    convertedAt: {
      type: Date,
    },
    // Additional details
    estimatedDuration: {
      type: Number, // in hours
    },
    proposedSchedule: {
      startDate: Date,
      preferredTime: String,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
jobApplicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true }); // One application per worker per job
jobApplicationSchema.index({ workerId: 1, status: 1 });
jobApplicationSchema.index({ customerId: 1, status: 1 });
jobApplicationSchema.index({
  status: 1,
  customerConfirmed: 1,
  workerConfirmed: 1,
});

// Middleware to check if both parties confirmed
jobApplicationSchema.pre("save", function (next) {
  // If both parties confirmed and not yet marked as confirmed
  if (
    this.customerConfirmed &&
    this.workerConfirmed &&
    this.status !== "confirmed"
  ) {
    this.status = "confirmed";
  }

  // If status changed to confirmed, mark the timestamp
  if (this.status === "confirmed" && !this.convertedToBooking) {
    // This will trigger booking conversion in the controller
    this.markModified("status");
  }

  next();
});

// Method to check if ready for booking conversion
jobApplicationSchema.methods.isReadyForBookingConversion = function () {
  return (
    this.customerConfirmed &&
    this.workerConfirmed &&
    this.status === "confirmed" &&
    !this.convertedToBooking
  );
};

// Static method to find applications ready for conversion
jobApplicationSchema.statics.findReadyForConversion = function () {
  return this.find({
    customerConfirmed: true,
    workerConfirmed: true,
    status: "confirmed",
    convertedToBooking: false,
  }).populate("jobId workerId customerId");
};

export const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema,
);