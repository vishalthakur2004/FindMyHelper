import axiosInstance from "../utils/axiosInterceptor";

const WORKER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/workers`;

export const workerService = {
  // Get nearby workers (used by customers)
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
      params.append("page", filters.page || 1);
      params.append("limit", filters.limit || 20);

      const response = await axiosInstance.get(
        `${WORKER_BASE_URL}/nearby?${params}`,
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

  // Get worker profile by ID
  getWorkerProfile: async (workerId) => {
    try {
      const response = await axiosInstance.get(
        `${WORKER_BASE_URL}/${workerId}`,
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

  // Update worker availability
  updateAvailability: async (availabilityData) => {
    try {
      const response = await axiosInstance.patch(
        `${WORKER_BASE_URL}/availability`,
        availabilityData,
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
          error.response?.data?.message || "Failed to update availability",
        error: error.response?.data,
      };
    }
  },

  // Update worker rates
  updateRates: async (rateData) => {
    try {
      const response = await axiosInstance.patch(
        `${WORKER_BASE_URL}/rates`,
        rateData,
      );
      return {
        success: true,
        data: response.data.worker,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update rates",
        error: error.response?.data,
      };
    }
  },

  // Get worker reviews
  getWorkerReviews: async (workerId, page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(
        `${WORKER_BASE_URL}/${workerId}/reviews?page=${page}&limit=${limit}`,
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

  // Search workers by skill or service
  searchWorkers: async (searchQuery, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append("q", searchQuery);

      // Add additional filters
      if (filters.location) params.append("location", filters.location);
      if (filters.radius) params.append("radius", filters.radius);
      if (filters.rating) params.append("minRating", filters.rating);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      params.append("page", filters.page || 1);
      params.append("limit", filters.limit || 20);

      const response = await axiosInstance.get(
        `${WORKER_BASE_URL}/search?${params}`,
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
};

export default workerService;
