import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 1000,
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
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  budget: Number,
  status: {
    type: String,
    enum: ["open", "assigned", "completed", "cancelled"],
    default: "open",
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  applications: [
    {
      workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      proposedAmount: Number,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  },
  {
    timestamps: true,
  },
);

jobPostSchema.index({ location: '2dsphere' });

export const JobPost = mongoose.model('JobPost', jobPostSchema);
