import express from "express";
import {
  createBookingFromJobApplication,
  getWorkerBookings,
  getCustomerBookings,
  updateBookingStatus,
  getBookingById,
} from "../controllers/booking.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateUser);

// Booking management
router.post("/request", createBookingFromJobApplication);
router.get("/worker", getWorkerBookings);
router.get("/customer", getCustomerBookings);
router.get("/:bookingId", getBookingById);
router.patch("/:bookingId/status", updateBookingStatus);

export default router;