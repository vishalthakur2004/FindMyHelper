import api from "./api";

export const bookingService = {
  // Get all bookings for current user
  getBookings: async (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });

    const response = await api.get(`/bookings?${params.toString()}`);
    return response;
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response;
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response;
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason });
    return response;
  },

  // Complete booking
  completeBooking: async (id) => {
    const response = await api.put(`/bookings/${id}/complete`);
    return response;
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await api.get("/bookings/stats");
    return response;
  },

  // Get upcoming bookings
  getUpcomingBookings: async () => {
    const response = await api.get("/bookings/upcoming");
    return response;
  },

  // Get booking history
  getBookingHistory: async () => {
    const response = await api.get("/bookings/history");
    return response;
  },
};
