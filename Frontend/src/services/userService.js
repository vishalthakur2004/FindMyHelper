import api from "./api";

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response;
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response;
  },

  // Search users (workers)
  searchUsers: async (searchQuery, filters = {}) => {
    const params = new URLSearchParams();
    params.append("q", searchQuery);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/users/search?${params.toString()}`);
    return response;
  },

  // Get workers by category
  getWorkersByCategory: async (category) => {
    const response = await api.get(`/users/workers/category/${category}`);
    return response;
  },

  // Get featured workers
  getFeaturedWorkers: async () => {
    const response = await api.get("/users/workers/featured");
    return response;
  },

  // Get nearby workers
  getNearbyWorkers: async (latitude, longitude, radius = 10) => {
    const response = await api.get(
      `/users/workers/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
    );
    return response;
  },

  // Update user location
  updateLocation: async (locationData) => {
    const response = await api.put("/users/location", locationData);
    return response;
  },

  // Upload documents (for worker verification)
  uploadDocuments: async (documents) => {
    const formData = new FormData();

    documents.forEach((doc, index) => {
      formData.append(`document_${index}`, doc.file);
      formData.append(`document_${index}_type`, doc.type);
    });

    const response = await api.post("/users/upload-documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  // Update worker skills
  updateWorkerSkills: async (skills) => {
    const response = await api.put("/users/worker/skills", { skills });
    return response;
  },

  // Update worker availability
  updateWorkerAvailability: async (availability) => {
    const response = await api.put("/users/worker/availability", availability);
    return response;
  },

  // Get worker earnings
  getWorkerEarnings: async (period = "month") => {
    const response = await api.get(`/users/worker/earnings?period=${period}`);
    return response;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/users/stats");
    return response;
  },

  // Follow/Unfollow user
  toggleFollowUser: async (userId) => {
    const response = await api.post(`/users/${userId}/follow`);
    return response;
  },

  // Get user followers
  getUserFollowers: async (userId) => {
    const response = await api.get(`/users/${userId}/followers`);
    return response;
  },

  // Get user following
  getUserFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/following`);
    return response;
  },
};
