import { JobPost } from "../models/jobPost.model.js";
import { JobApplication } from "../models/jobApplication.model.js";
import { Booking } from "../models/booking.model.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      message,
      proposedAmount,
      estimatedDuration,
      proposedSchedule,
      notes,
    } = req.body;

    const workerId = req.user._id;

    const job = await JobPost.findById(jobId);
    if (!job || job.status !== "open") {
      return res.status(400).json({ success: false, message: "Job is not open" });
    }

    const exists = await JobApplication.findOne({ jobId, workerId });
    if (exists) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const application = await JobApplication.create({
      jobId,
      workerId,
      customerId: job.customerId,
      message,
      proposedAmount,
      estimatedDuration,
      proposedSchedule,
      notes,
    });

    res.status(201).json({ success: true, message: "Application submitted", application });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ success: false, message: "Failed to apply" });
  }
};

// Customer updates application status (accept/reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const customerId = req.user._id;

    const app = await JobApplication.findOne({ _id: applicationId, customerId });
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    app.status = status;
    if (status === "accepted") {
      const job = await JobPost.findById(app.jobId);
      if (job) {
        job.status = "assigned";
        job.assignedWorker = app.workerId;
        await job.save();
      }
    }

    await app.save();
    res.status(200).json({ success: true, message: `Application ${status}` });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// Confirm from worker/customer for booking
export const confirmApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;
    const role = req.user.role;

    const app = await JobApplication.findById(applicationId);
    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (role === "worker") {
      app.workerConfirmed = true;
      app.workerConfirmedAt = new Date();
    } else if (role === "customer") {
      app.customerConfirmed = true;
      app.customerConfirmedAt = new Date();
    }

    await app.save();

    // Auto-create booking if both confirmed
    if (app.isReadyForBookingConversion()) {
      const booking = await Booking.create({
        customerId: app.customerId,
        workerId: app.workerId,
        serviceCategory: app.serviceCategory,
        scheduledDate: new Date(),
        location: app.location,
        amount: app.proposedAmount,
        paymentMethod: "cash",
      });

      app.convertedToBooking = true;
      app.convertedAt = new Date();
      app.bookingId = booking._id;
      await app.save();
    }

    res.status(200).json({ success: true, message: "Confirmation updated", application: app });
  } catch (error) {
    console.error("Confirm Error:", error);
    res.status(500).json({ success: false, message: "Failed to confirm application" });
  }
};

// Get applications for a customer
export const getApplicationsForCustomer = async (req, res) => {
  try {
    const customerId = req.user._id;
    const applications = await JobApplication.find({ customerId }).populate("workerId jobId");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Get customer apps error:", error);
    res.status(500).json({ success: false, message: "Failed to get applications" });
  }
};

// Get applications submitted by a worker
export const getMyApplications = async (req, res) => {
  try {
    const workerId = req.user._id;
    const applications = await JobApplication.find({ workerId }).populate("jobId");
    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Get worker apps error:", error);
    res.status(500).json({ success: false, message: "Failed to get applications" });
  }
};
