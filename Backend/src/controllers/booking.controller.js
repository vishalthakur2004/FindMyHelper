import { Booking } from "../models/booking.model.js";
import { JobPost } from "../models/jobPost.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { User } from "../models/user.model.js";

export const createBookingFromJobApplication = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { jobId, applicationId } = req.body;

    // Verify customer role
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create bookings" });
    }

    // Validate job
    const job = await JobPost.findOne({ _id: jobId, customerId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    // Validate application
    const application = await JobApplication.findOne({
      _id: applicationId,
      jobId,
      status: "pending",
    }).populate("workerId");

    if (!application) {
      return res.status(404).json({ message: "Job application not found or already handled" });
    }

    // Create booking
    const booking = await Booking.create({
      customerId,
      workerId: application.workerId._id,
      serviceCategory: job.serviceCategory,
      scheduledDate: new Date(application.availabilityDate),
      amount: application.expectedRate,
      location: job.location,
      address: job.address,
      description: job.description,
      status: "pending",
      urgent: false, // Default, can be updated
      jobId: job._id,
    });

    // Update job post to mark it assigned
    job.status = "assigned";
    job.assignedWorker = application.workerId._id;
    await job.save();

    // Update application status
    application.status = "accepted";
    await application.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customerId", "fullName email address")
      .populate("workerId", "fullName profession photo");

    res.status(201).json({
      success: true,
      message: "Booking created from job application",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking from job application error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getWorkerBookings = async (req, res) => {
  try {
    const workerId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Verify user is a worker
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    // Build query
    const query = { workerId };
    if (status) {
      query.status = status;
    } else {
      // Default to active bookings (exclude completed and cancelled)
      query.status = { $in: ["pending", "accepted", "in-progress"] };
    }

    const bookings = await Booking.find(query)
      .populate("customerId", "fullName email address photo")
      .sort({ scheduledDate: 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalBookings,
        pages: Math.ceil(totalBookings / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get worker bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;

    // Verify user is a customer
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      });
    }

    // Build query
    const query = { customerId };
    if (status) {
      query.status = status;
    } else {
      // Default to active bookings
      query.status = { $in: ["requested", "accepted", "in_progress"] };
    }

    const bookings = await Booking.find(query)
      .populate("workerId", "fullName profession photo avgRating")
      .sort({ scheduledDate: 1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalBookings,
        pages: Math.ceil(totalBookings / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get customer bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Validate status
    const validStatuses = [
      "accepted",
      "rejected",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate("customerId", "fullName")
      .populate("workerId", "fullName");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check permissions based on status change
    if (["accepted", "rejected", "in_progress", "completed"].includes(status)) {
      // Only worker can update these statuses
      if (booking.workerId._id.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. Only the assigned worker can update this status.",
        });
      }
    } else if (status === "cancelled") {
      // Both customer and worker can cancel
      if (
        booking.customerId._id.toString() !== userId.toString() &&
        booking.workerId._id.toString() !== userId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied.",
        });
      }
    }

    // Validate status transitions
    const currentStatus = booking.status;
    const validTransitions = {
      pending: ["accepted", "rejected", "cancelled"],
      accepted: ["in-progress", "cancelled"],
      "in-progress": ["completed", "cancelled"],
      completed: ["confirmed"],
      cancelled: [],
      rejected: [],
      confirmed: [],
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    // Update booking status
    booking.status = status;

    // Set completion date if completed
    if (status === "completed") {
      booking.completedAt = new Date();
      booking.paymentStatus = "pending"; // Set payment as pending for manual processing

      // Calculate worker earning (assuming 80% goes to worker, 20% platform fee)
      booking.workerEarning = booking.amount * 0.8;

      // Update worker's total earnings
      await User.findByIdAndUpdate(booking.workerId._id, {
        $inc: { totalEarnings: booking.workerEarning },
      });
    }

    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate("customerId", "fullName email address")
      .populate("workerId", "fullName profession photo");

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate("customerId", "fullName email address photo")
      .populate("workerId", "fullName profession photo avgRating");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user has access to this booking
    if (
      booking.customerId._id.toString() !== userId.toString() &&
      booking.workerId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
    });
  }
};