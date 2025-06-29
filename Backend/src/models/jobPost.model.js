import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
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
        "technician",
        "home-cleaner",
        "mechanic",
      ],
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
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
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    budget: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["open", "assigned", "completed", "cancelled"],
      default: "open",
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

jobPostSchema.index({ location: "2dsphere" });

export const JobPost = mongoose.model("JobPost", jobPostSchema);
