import axios from "axios";
import { store } from "../store/store";
import { setAccessToken, clearUserInfo } from "../features/userSlice";
import { refreshAccessToken } from "./refreshAccessToken";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors gracefully
    if (!error.response) {
      // Network error - backend not reachable
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        const enhancedError = new Error(
          "Backend server is not running. Please start the backend server.",
        );
        enhancedError.isNetworkError = true;
        enhancedError.originalError = error;
        return Promise.reject(enhancedError);
      }
    }

    // Handle 401 authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(clearUserInfo());
        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;