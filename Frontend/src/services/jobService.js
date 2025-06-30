import api from "./api";

export const jobService = {
  // Get all jobs with filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/jobs?${params.toString()}`);
    return response;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response;
  },

  // Create new job
  createJob: async (jobData) => {
    const response = await api.post("/jobs", jobData);
    return response;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response;
  },

  // Get jobs by user (customer's posted jobs)
  getUserJobs: async () => {
    const response = await api.get("/jobs/my-jobs");
    return response;
  },

  // Search jobs
  searchJobs: async (searchQuery) => {
    const response = await api.get(
      `/jobs/search?q=${encodeURIComponent(searchQuery)}`,
    );
    return response;
  },

  // Get job categories
  getJobCategories: async () => {
    const response = await api.get("/jobs/categories");
    return response;
  },

  // Apply for job (worker)
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response;
  },

  // Get job applications for a job (customer)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applications`);
    return response;
  },

  // Update application status
  updateApplicationStatus: async (jobId, applicationId, status) => {
    const response = await api.put(
      `/jobs/${jobId}/applications/${applicationId}`,
      { status },
    );
    return response;
  },
};
