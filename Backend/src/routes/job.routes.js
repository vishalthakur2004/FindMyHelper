import express from "express";
import {
  createJobPost,
  getNearbyJobs,
  getMyJobPosts,
  applyForJob,
  updateApplicationStatus,
  deleteJobPost,
  getJobById,
} from "../controllers/job.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateUser);

// Job post management
router.post("/post", createJobPost);
router.get("/my-posts", getMyJobPosts);
router.get("/nearby", getNearbyJobs);
router.get("/:jobId", getJobById);
router.delete("/:jobId", deleteJobPost);

// Job applications
router.post("/:jobId/apply", applyForJob);
router.patch("/:jobId/applications/:applicationId", updateApplicationStatus);

export default router;