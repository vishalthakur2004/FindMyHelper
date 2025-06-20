import { JobPost } from "../models/jobPost.model.js";
import { User } from "../models/user.model.js";

const getSortCriteria = (sortBy) => {
  switch (sortBy) {
    case "oldest":
      return { createdAt: 1 };
    case "budget-high":
      return { budget: -1, createdAt: -1 };
    case "budget-low":
      return { budget: 1, createdAt: -1 };
    case "distance":
      return { distance: 1, createdAt: -1 };
    default: // 'newest'
      return { createdAt: -1 };
  }
};

export const createJobPost = async (req, res) => {
  try {
    const { title, description, serviceCategory, budget, address } = req.body;

    const customerId = req.user._id;

    // Validate required fields
    if (!title || !serviceCategory || !budget) {
      return res.status(400).json({
        success: false,
        message: "Title, service category, and budget are required",
      });
    }

    // Get customer's location for the job post
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Create job post
    const jobPost = await JobPost.create({
      customerId,
      title,
      description,
      serviceCategory: serviceCategory.toLowerCase(),
      budget: parseFloat(budget),
      address: address || customer.address,
      location: customer.location,
    });

    const populatedJob = await JobPost.findById(jobPost._id)
      .populate("customerId", "fullName email")
      .exec();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: populatedJob,
    });
  } catch (error) {
    console.error("Create job post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job post",
    });
  }
};

export const getNearbyJobs = async (req, res) => {
  try {
    const workerId = req.user._id;
    const {
      profession,
      radius = 10000,
      page = 1,
      limit = 20,
      budget_min,
      budget_max,
      location,
      urgency,
      sortBy = "newest",
    } = req.query;

    // Get worker location
    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    // Build query
    const query = {
      status: "open",
      "applications.workerId": { $ne: workerId }, // Exclude jobs already applied to
    };

    // Filter by profession if specified
    if (profession) {
      query.serviceCategory = profession.toLowerCase();
    } else if (worker.profession) {
      // Use worker's profession as default filter
      const professionMap = {
        Plumber: "plumber",
        Electrician: "electrician",
        Carpenter: "carpenter",
        Painter: "painter",
        Mason: "mason",
      };
      query.serviceCategory =
        professionMap[worker.profession] || worker.profession.toLowerCase();
    }

    // Add budget filters
    if (budget_min || budget_max) {
      query.budget = {};
      if (budget_min) query.budget.$gte = parseFloat(budget_min);
      if (budget_max) query.budget.$lte = parseFloat(budget_max);
    }

    // Add urgency filter
    if (urgency === "urgent") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.createdAt = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    } else if (urgency === "this-week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.createdAt = { $gte: weekAgo };
    }

    // Add location text filter
    if (location) {
      query.$or = [
        { "address.city": new RegExp(location, "i") },
        { "address.state": new RegExp(location, "i") },
        { "address.pincode": new RegExp(location, "i") },
      ];
    }

    // Build aggregation pipeline
    const pipeline = [];

    // Add location filter if worker has location
    if (
      worker.location &&
      worker.location.coordinates &&
      worker.location.coordinates[0] !== 0
    ) {
      pipeline.push({
        $geoNear: {
          near: worker.location,
          distanceField: "distance",
          maxDistance: parseInt(radius),
          spherical: true,
          query: query,
        },
      });
    } else {
      // If no location, just match the query
      pipeline.push({ $match: query });
      // Add a default distance field
      pipeline.push({ $addFields: { distance: 0 } });
    }

    // Add remaining pipeline stages
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          serviceCategory: 1,
          budget: 1,
          address: 1,
          status: 1,
          createdAt: 1,
          distance: 1,
          applications: 1,
          customer: {
            _id: "$customer._id",
            fullName: "$customer.fullName",
          },
        },
      },
      {
        $sort: getSortCriteria(sortBy),
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    );

    const jobs = await JobPost.aggregate(pipeline);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: jobs.length,
      },
    });
  } catch (error) {
    console.error("Get nearby jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby jobs",
    });
  }
};

export const getMyJobPosts = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Verify user is a customer
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      });
    }

    const jobs = await JobPost.find({ customerId })
      .populate({
        path: "applications.workerId",
        select: "fullName profession photo avgRating",
      })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalJobs = await JobPost.countDocuments({ customerId });

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalJobs,
        pages: Math.ceil(totalJobs / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get my job posts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job posts",
    });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { proposedAmount, message } = req.body;
    const workerId = req.user._id;

    // Validate input
    if (!proposedAmount || !message) {
      return res.status(400).json({
        success: false,
        message: "Proposed amount and message are required",
      });
    }

    // Verify user is a worker
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      });
    }

    // Find the job
    const job = await JobPost.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if job is still open
    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Job is no longer accepting applications",
      });
    }

    // Check if worker already applied
    const existingApplication = job.applications.find(
      (app) => app.workerId.toString() === workerId.toString(),
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Add application
    job.applications.push({
      workerId,
      message: message.trim(),
      proposedAmount: parseFloat(proposedAmount),
      status: "pending",
    });

    await job.save();

    // Populate the new application with worker details
    const updatedJob = await JobPost.findById(jobId).populate({
      path: "applications.workerId",
      select: "fullName profession photo avgRating",
    });

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, applicationId } = req.params;
    const { status } = req.body;
    const customerId = req.user._id;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be accepted or rejected",
      });
    }

    // Find the job and verify ownership
    const job = await JobPost.findOne({ _id: jobId, customerId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    // Find the application
    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Update application status
    application.status = status;

    // If accepted, update job status and assign worker
    if (status === "accepted") {
      job.status = "assigned";
      job.assignedWorker = application.workerId;

      // Reject all other pending applications
      job.applications.forEach((app) => {
        if (app._id.toString() !== applicationId && app.status === "pending") {
          app.status = "rejected";
        }
      });
    }

    await job.save();

    const updatedJob = await JobPost.findById(jobId)
      .populate({
        path: "applications.workerId",
        select: "fullName profession photo avgRating",
      })
      .populate("assignedWorker", "fullName profession photo");

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

export const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user._id;

    const job = await JobPost.findOneAndDelete({ _id: jobId, customerId });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job post deleted successfully",
    });
  } catch (error) {
    console.error("Delete job post error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job post",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPost.findById(jobId)
      .populate("customerId", "fullName email address")
      .populate({
        path: "applications.workerId",
        select: "fullName profession photo avgRating",
      })
      .populate("assignedWorker", "fullName profession photo");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get job by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch job details",
    });
  }
};