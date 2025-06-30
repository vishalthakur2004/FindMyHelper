import api from "./api";

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response;
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response;
  },

  // Verify phone number
  verifyPhone: async (phoneData) => {
    const response = await api.post("/auth/verify-phone", phoneData);
    return response;
  },

  // Send OTP
  sendOTP: async (phoneNumber) => {
    const response = await api.post("/auth/send-otp", { phoneNumber });
    return response;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post("/auth/verify-otp", otpData);
    return response;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/auth/profile", profileData);
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put("/auth/change-password", passwordData);
    return response;
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/auth/upload-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
};
