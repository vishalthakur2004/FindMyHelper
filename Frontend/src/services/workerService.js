import axiosInstance from "../utils/axiosInterceptor";

const USER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const workerService = {
  // Get worker profile by ID
  getWorkerProfile: async (workerId) => {
    try {
      const response = await axiosInstance.get(
        `${USER_BASE_URL}/worker/${workerId}`,
      );
      return {
        success: true,
        data: response.data.worker,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch worker profile",
        error: error.response?.data,
      };
    }
  },

  // Search workers by location and filters
  searchWorkers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.location) params.append("location", filters.location);
      if (filters.serviceCategory)
        params.append("serviceCategory", filters.serviceCategory);
      if (filters.radius) params.append("radius", filters.radius);
      if (filters.minRating) params.append("minRating", filters.minRating);
      if (filters.availability)
        params.append("availability", filters.availability);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await axiosInstance.get(
        `/bookings/workers-nearby?${params}`,
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
        message: error.response?.data?.message || "Failed to search workers",
        error: error.response?.data,
      };
    }
  },

  // Get worker reviews/ratings
  getWorkerReviews: async (workerId, page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `${USER_BASE_URL}/worker/${workerId}/reviews?page=${page}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data.reviews || [],
        pagination: response.data.pagination,
        stats: response.data.stats,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch worker reviews",
        error: error.response?.data,
      };
    }
  },

  // Update worker availability status
  updateAvailability: async (isAvailable) => {
    try {
      const response = await axiosInstance.patch(
        `${USER_BASE_URL}/update-account`,
        {
          isAvailable,
        },
      );
      return {
        success: true,
        data: response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update availability",
        error: error.response?.data,
      };
    }
  },

  // Update worker location
  updateLocation: async (location) => {
    try {
      const response = await axiosInstance.patch(
        `${USER_BASE_URL}/update-account`,
        {
          location,
        },
      );
      return {
        success: true,
        data: response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update location",
        error: error.response?.data,
      };
    }
  },

  // Get worker dashboard stats
  getWorkerStats: async () => {
    try {
      const bookingsResponse = await axiosInstance.get(
        "/bookings/worker-current",
      );
      const bookings = bookingsResponse.data.bookings || [];

      // Calculate stats from bookings
      const stats = {
        totalBookings: bookings.length,
        completedBookings: bookings.filter((b) => b.status === "completed")
          .length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        inProgressBookings: bookings.filter((b) => b.status === "in-progress")
          .length,
        totalEarnings: bookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + (b.amount || 0), 0),
        averageRating: 0, // This would need to be calculated from reviews
      };

      return {
        success: true,
        data: stats,
        message: "Worker stats fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch worker stats",
        error: error.response?.data,
      };
    }
  },
};

export default workerService;