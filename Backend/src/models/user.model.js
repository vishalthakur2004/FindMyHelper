import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
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
      enum: ['customer', 'worker'],
      default: 'customer',
    },
    profession: {
      type: String,
      required: function () {
        return this.role === 'worker';
      },
      enum: [
        // Home Services
        'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Mason', 'AC Technician',
        'Appliance Repair Technician', 'Interior Designer', 'Pest Control Specialist',
        'Roofer', 'Gardener', 'Home Cleaner', 'Sofa Cleaner', 'Glass Cleaner',
        // Vehicle Services
        'Mechanic', 'Car Washer', 'Bike Servicing', 'Auto Electrician', 'Car Interior Cleaning',
        // Personal Services
        'Beautician', 'Hairdresser', 'Makeup Artist', 'Massage Therapist', 'Personal Trainer', 'Dietitian',
        // Household Help
        'Cook', 'Nanny', 'Babysitter', 'Elderly Caregiver', 'Housemaid', 'Laundry/Dry Cleaning Pickup',
        // Other Skilled Services
        'CCTV Installer', 'Computer Technician', 'Mobile Repair Technician', 'Tailor', 'Locksmith',
        'Refrigerator Repair', 'Washing Machine Repair',
        // Logistics and Delivery
        'Furniture Mover', 'Delivery Boy', 'Parcel Packing Helper',
        // Tutoring & Education
        'Home Tutor', 'Language Trainer', 'Music Teacher', 'Dance Instructor', 'Yoga Instructor'
      ],
    },
    photo: {
      type: String,
      required: function () {
        return this.role === 'worker';
      },
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
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
        return this.role === 'worker';
      },
      default: [],
    },
    bookingsAday: {
      type: Number,
    },    
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    totalEarnings: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

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
    }
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
    }
  );
};

userSchema.index({ location: '2dsphere' });

export const User = mongoose.model('User', userSchema);


