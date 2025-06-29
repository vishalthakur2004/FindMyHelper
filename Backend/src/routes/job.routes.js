import express from "express";
import {
  createJobPost,
  getMyJobPosts,
  deleteJobPost,
  updateJobPost,
  getJobById,
  getNearbyJobs,
  repostJob,
} from "../controllers/job.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticateUser, createJobPost);
router.get("/my", authenticateUser, getMyJobPosts);
router.get("/:jobId", authenticateUser, getJobById);
router.put("/:jobId", authenticateUser, updateJobPost);
router.delete("/:jobId", authenticateUser, deleteJobPost);

// Worker: repost job
router.post("/:jobId/repost", authenticateUser, repostJob);

// Worker: fetch nearby jobs
router.get("/nearby/all", authenticateUser, getNearbyJobs);

export default router;
