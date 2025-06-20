import axiosInstance from "../utils/axiosInterceptor";

const JOB_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/jobs`;

export const jobService = {
  // Create a job post
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post(
        `${JOB_BASE_URL}/post`,
        jobData,
      );
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create job post",
        error: error.response?.data,
      };
    }
  },

  // Get nearby jobs for workers
  getNearbyJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.location) params.append("location", filters.location);
      if (filters.budget?.min) params.append("budget_min", filters.budget.min);
      if (filters.budget?.max) params.append("budget_max", filters.budget.max);
      if (filters.serviceCategory)
        params.append("profession", filters.serviceCategory);
      if (filters.urgency) params.append("urgency", filters.urgency);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      params.append("page", filters.page || 1);
      params.append("limit", filters.limit || 20);

      const response = await axiosInstance.get(
        `${JOB_BASE_URL}/nearby?${params}`,
      );
      return {
        success: true,
        data: response.data.jobs || [],
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch nearby jobs",
        error: error.response?.data,
      };
    }
  },

  // Get customer's job posts
  getMyJobPosts: async (page = 1, limit = 20) => {
    try {
      const response = await axiosInstance.get(
        `${JOB_BASE_URL}/my-posts?page=${page}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data.jobs || [],
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch job posts",
        error: error.response?.data,
      };
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await axiosInstance.get(`${JOB_BASE_URL}/${jobId}`);
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch job details",
        error: error.response?.data,
      };
    }
  },

  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await axiosInstance.post(
        `${JOB_BASE_URL}/${jobId}/apply`,
        applicationData,
      );
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to apply for job",
        error: error.response?.data,
      };
    }
  },

  // Update application status (for job posters)
  updateApplicationStatus: async (jobId, applicationId, status) => {
    try {
      const response = await axiosInstance.patch(
        `${JOB_BASE_URL}/${jobId}/applications/${applicationId}`,
        { status },
      );
      return {
        success: true,
        data: response.data.job,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update application status",
        error: error.response?.data,
      };
    }
  },

  // Delete job post
  deleteJobPost: async (jobId) => {
    try {
      const response = await axiosInstance.delete(`${JOB_BASE_URL}/${jobId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete job post",
        error: error.response?.data,
      };
    }
  },

  // Get job applications for a specific job (for job posters)
  getMyApplications: async (page = 1, limit = 20) => {
    try {
      const response = await axiosInstance.get(
        `${JOB_BASE_URL}/my-applications?page=${page}&limit=${limit}`,
      );
      return {
        success: true,
        data: response.data.applications || [],
        pagination: response.data.pagination,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch applications",
        error: error.response?.data,
      };
    }
  },
};

export default jobService;