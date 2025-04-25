import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
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
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: false,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export const Review = mongoose.model('Review', reviewSchema);
  