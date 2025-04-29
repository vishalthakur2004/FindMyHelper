import express from "express";
import {
  checkAvailability,
  sendOtpToPhone,
  verifyOtp,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateAccountDetails,
  updateProfilePhoto,
  getCurrentUser,
  getWorkerProfile
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // multer middleware for file uploads

const router = express.Router();

// Public routes
router.post("/check-availability", checkAvailability);
router.post("/send-otp", sendOtpToPhone);
router.post("/verify-otp", verifyOtp);
router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", authenticateUser, logoutUser);
router.post("/change-password", authenticateUser, changePassword);
router.patch("/update-account", authenticateUser, updateAccountDetails);
router.patch("/update-photo", authenticateUser, upload.single("photo"), updateProfilePhoto);
router.get("/me", authenticateUser, getCurrentUser);
router.get("/worker/:workerId", getWorkerProfile);

export default router;
