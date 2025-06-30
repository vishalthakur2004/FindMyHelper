import api from "./api";

export const reviewService = {
  // Get reviews with filters
  getReviews: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/reviews?${params.toString()}`);
    return response;
  },

  // Get review by ID
  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response;
  },

  // Create new review
  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  },

  // Get reviews for a user (worker)
  getUserReviews: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response;
  },

  // Get review statistics for a user
  getUserReviewStats: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}/stats`);
    return response;
  },

  // Get my reviews (reviews I wrote)
  getMyReviews: async () => {
    const response = await api.get("/reviews/my-reviews");
    return response;
  },

  // Get reviews about me (reviews others wrote about me)
  getReviewsAboutMe: async () => {
    const response = await api.get("/reviews/about-me");
    return response;
  },

  // Report review
  reportReview: async (reviewId, reason) => {
    const response = await api.post(`/reviews/${reviewId}/report`, { reason });
    return response;
  },
};
