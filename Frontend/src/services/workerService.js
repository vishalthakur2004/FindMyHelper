import axiosInstance from "../utils/axiosInterceptor";

const WORKER_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/workers`;

export const workerService = {
  getNearbyWorkers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.location) params.append("location", filters.location);
      if (filters.serviceCategory)
        params.append("profession", filters.serviceCategory);
      if (filters.radius) params.append("radius", filters.radius * 1000); // Convert km to meters
      if (filters.rating) params.append("minRating", filters.rating);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

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

  // Update worker availability status
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
};

export default workerService;