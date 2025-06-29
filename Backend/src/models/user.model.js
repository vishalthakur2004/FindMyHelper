import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "worker"],
      default: "customer",
    },
    profession: {
      type: String,
      required: function () {
        return this.role === "worker";
      },
      enum: [
        "Plumber",
        "Electrician",
        "Carpenter",
        "Painter",
        "Mason",
        "Technician",
        "Home Cleaner",
        "Mechanic",
      ],
    },
    photo: {
      type: String,
      required: function () {
        return this.role === "worker";
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    address: {
      required: true,
      type: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
      },
    },
    availabilityTimes: {
      type: [availabilitySchema],
      required: function () {
        return this.role === "worker";
      },
      default: [],
    },
    bookingsAday: {
      type: Number,
      default: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    manualStatusOverride: {
      type: Boolean,
      default: false, // Whether the worker has manually set their status
    },
    lastStatusUpdate: {
      type: Date,
      default: Date.now,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    experienceYears: {
      type: Number,
      default: 1,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    totalEarnings: {
      type: Number,
      default: 0,
    },
    locationPermissionGranted: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
      profession: this.profession,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema);