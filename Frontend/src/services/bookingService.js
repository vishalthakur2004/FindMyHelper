import axiosInstance from "../utils/axiosInterceptor";

const BOOKING_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/bookings`;

export const bookingService = {
  // Create a booking request
  createBookingRequest: async (bookingData) => {
    try {
      const response = await axiosInstance.post(
        `${BOOKING_BASE_URL}/request`,
        bookingData,
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create booking request",
        error: error.response?.data,
      };
    }
  },

  // Get nearby workers
  getNearbyWorkers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.location) params.append("location", filters.location);
      if (filters.serviceCategory)
        params.append("profession", filters.serviceCategory);
      if (filters.radius) params.append("radius", filters.radius);
      if (filters.rating) params.append("minRating", filters.rating);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await axiosInstance.get(
        `${BOOKING_BASE_URL}/nearby-workers?${params}`,
      );
      return {
        success: true,
        data: response.data.workers || [],
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch nearby workers",
        error: error.response?.data,
      };
    }
  },

  // Get worker's bookings
  getWorkerBookings: async (status = "") => {
    try {
      const params = status ? `?status=${status}` : "";
      const response = await axiosInstance.get(
        `${BOOKING_BASE_URL}/worker${params}`,
      );
      return {
        success: true,
        data: response.data.bookings || [],
        stats: response.data.stats,
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch worker bookings",
        error: error.response?.data,
      };
    }
  },

  // Get customer's bookings
  getCustomerBookings: async (status = "") => {
    try {
      const params = status ? `?status=${status}` : "";
      const response = await axiosInstance.get(
        `${BOOKING_BASE_URL}/customer${params}`,
      );
      return {
        success: true,
        data: response.data.bookings || [],
        stats: response.data.stats,
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch customer bookings",
        error: error.response?.data,
      };
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await axiosInstance.get(
        `${BOOKING_BASE_URL}/${bookingId}`,
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch booking details",
        error: error.response?.data,
      };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status, feedback = "") => {
    try {
      const response = await axiosInstance.patch(
        `${BOOKING_BASE_URL}/${bookingId}/status`,
        { status, feedback },
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update booking status",
        error: error.response?.data,
      };
    }
  },

  // Accept booking (worker)
  acceptBooking: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "accepted");
  },

  // Reject booking (worker)
  rejectBooking: async (bookingId, reason = "") => {
    return bookingService.updateBookingStatus(bookingId, "rejected", reason);
  },

  // Start work (worker)
  startWork: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "in-progress");
  },

  // Complete work (worker)
  completeWork: async (bookingId) => {
    return bookingService.updateBookingStatus(bookingId, "completed");
  },

  // Cancel booking (customer or worker)
  cancelBooking: async (bookingId, reason = "") => {
    return bookingService.updateBookingStatus(bookingId, "cancelled", reason);
  },

  // Confirm completion (customer)
  confirmCompletion: async (bookingId, rating = null, review = "") => {
    try {
      const response = await axiosInstance.patch(
        `${BOOKING_BASE_URL}/${bookingId}/status`,
        {
          status: "confirmed",
          rating,
          review,
        },
      );
      return {
        success: true,
        data: response.data.booking,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to confirm booking completion",
        error: error.response?.data,
      };
    }
  },
};

export default bookingService;