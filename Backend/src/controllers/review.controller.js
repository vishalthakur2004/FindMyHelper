import { Review } from "../models/review.model.js";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";

// ✅ 1. Submit a new review
export const submitReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findById(bookingId);
    if (
      !booking ||
      booking.customerId.toString() !== customerId.toString() ||
      booking.status !== "completed"
    ) {
      return res.status(403).json({ message: "Invalid or incomplete booking" });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: "Review already submitted for this booking" });
    }

    const review = await Review.create({
      customerId,
      workerId: booking.workerId,
      bookingId,
      rating,
      comment,
    });

    await User.findByIdAndUpdate(booking.workerId, {
      $inc: { completedJobs: 1 },
    });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

// ✅ 2. Update existing review
export const updateReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ message: "Access denied. Not your review." });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// ✅ 3. Delete review
export const deleteReview = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ message: "Access denied. Not your review." });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

// ✅ 4. Get all reviews by the customer
export const getMyReviews = async (req, res) => {
  try {
    const customerId = req.user._id;

    const reviews = await Review.find({ customerId })
      .populate("workerId", "fullName profession photo")
      .populate("bookingId", "scheduledDate serviceCategory status");

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};
