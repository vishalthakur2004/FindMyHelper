import mongoose from "mongoose";

const monthlyEarningsSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: Number, // 1 - 12
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
}, {
  timestamps: true
});

monthlyEarningsSchema.index({ workerId: 1, month: 1, year: 1 }, { unique: true });

export const MonthlyEarnings = mongoose.model("MonthlyEarnings", monthlyEarningsSchema);
