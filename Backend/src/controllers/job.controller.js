import { JobPost } from "../models/jobPost.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

// Utility for sorting
const getSortCriteria = (sortBy) => {
  switch (sortBy) {
    case "oldest": return { createdAt: 1 };
    case "budget-high": return { budget: -1 };
    case "budget-low": return { budget: 1 };
    default: return { createdAt: -1 };
  }
};

// Create Job Post
export const createJobPost = async (req, res) => {
  try {
    const { title, description, serviceCategory, budget, address } = req.body;
    const customerId = req.user._id;

    if (!title || !serviceCategory || !budget || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const customer = await User.findById(customerId);
    if (!customer || !customer.location) {
      return res.status(404).json({ success: false, message: "Customer not found or missing location" });
    }

    const job = await JobPost.create({
      customerId,
      title,
      description,
      serviceCategory: serviceCategory.toLowerCase(),
      budget: parseFloat(budget),
      address,
      location: customer.location,
    });

    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};

// Edit Job Post (if not yet assigned)
export const updateJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;
    const customerId = req.user._id;

    const job = await JobPost.findOne({ _id: jobId, customerId });
    if (!job || job.status !== "open") {
      return res.status(400).json({ success: false, message: "Job not editable" });
    }

    Object.assign(job, updates);
    await job.save();

    res.status(200).json({ success: true, message: "Job updated", job });
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
};

// Delete Job Post
export const deleteJobPost = async (req, res) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user._id;

    const job = await JobPost.findOneAndDelete({ _id: jobId, customerId });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

// Get My Job Posts
export const getMyJobPosts = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const jobs = await JobPost.find({ customerId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("assignedWorker", "fullName photo profession");

    const total = await JobPost.countDocuments({ customerId });

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);
    res.status(500).json({ success: false, message: "Failed to get job posts" });
  }
};

// Get Job By ID
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ success: false, message: "Invalid Job ID" });
    }

    const job = await JobPost.findById(jobId)
      .populate("customerId", "fullName email")
      .populate("assignedWorker", "fullName photo profession");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Get Job Error:", error);
    res.status(500).json({ success: false, message: "Failed to get job" });
  }
};

// List Nearby Jobs for Worker
export const getNearbyJobs = async (req, res) => {
  try {
    const workerId = req.user._id;
    const {
      profession,
      radius = 10000,
      page = 1,
      limit = 10,
      budget_min,
      budget_max,
    } = req.query;

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(403).json({ success: false, message: "Worker access required" });
    }

    const query = {
      status: "open",
    };

    if (profession) query.serviceCategory = profession.toLowerCase();
    if (budget_min || budget_max) {
      query.budget = {};
      if (budget_min) query.budget.$gte = parseFloat(budget_min);
      if (budget_max) query.budget.$lte = parseFloat(budget_max);
    }

    const geoQuery = worker.location?.coordinates?.length === 2 ? {
      $geoNear: {
        near: { type: "Point", coordinates: worker.location.coordinates },
        distanceField: "distance",
        maxDistance: parseInt(radius),
        spherical: true,
        query,
      },
    } : null;

    const pipeline = [];
    if (geoQuery) pipeline.push(geoQuery);
    else pipeline.push({ $match: query });

    pipeline.push(
      { $sort: getSortCriteria("newest") },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    const jobs = await JobPost.aggregate(pipeline);
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Nearby Jobs Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch nearby jobs" });
  }
};

// Repost Job (Clone and Post Again)
export const repostJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const customerId = req.user._id;

    const job = await JobPost.findOne({ _id: jobId, customerId });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found or unauthorized" });
    }

    const newJob = await JobPost.create({
      customerId: job.customerId,
      title: job.title,
      description: job.description,
      serviceCategory: job.serviceCategory,
      budget: job.budget,
      address: job.address,
      location: job.location,
    });

    res.status(201).json({ success: true, message: "Job reposted", job: newJob });
  } catch (error) {
    console.error("Repost Error:", error);
    res.status(500).json({ success: false, message: "Failed to repost job" });
  }
};