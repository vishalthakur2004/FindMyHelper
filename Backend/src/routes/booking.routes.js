import express from "express";
import {
  createBookingRequest,
  getWorkerBookings,
  getCustomerBookings,
  updateBookingStatus,
  getNearbyWorkers,
  getBookingById,
} from "../controllers/booking.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateUser);

// Booking management
router.post("/request", createBookingRequest);
router.get("/worker-current", getWorkerBookings);
router.get("/customer-current", getCustomerBookings);
router.get("/:bookingId", getBookingById);
router.patch("/:bookingId/status", updateBookingStatus);

// Worker discovery
router.get("/workers-nearby", getNearbyWorkers);

export default router;