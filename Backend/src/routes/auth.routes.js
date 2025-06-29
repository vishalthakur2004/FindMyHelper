import express from "express";
import {
  getCurrentUser,
  changePassword,
  updateAccountDetails,
  updateProfilePhoto,
  updateUserLocation,
  getWorkerProfile,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/me", authenticateUser, getCurrentUser);
router.put("/change-password", authenticateUser, changePassword);
router.put("/update", authenticateUser, updateAccountDetails);
router.put("/update-location", authenticateUser, updateUserLocation);
router.put("/update-photo", authenticateUser, upload.single("photo"), updateProfilePhoto);
router.get("/worker/:workerId", getWorkerProfile);

export default router;
