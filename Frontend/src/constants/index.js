// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    VERIFY_PHONE: "/auth/verify-phone",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
  },
  USERS: "/users",
  JOBS: "/jobs",
  BOOKINGS: "/bookings",
  REVIEWS: "/reviews",
};

// User roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  WORKER: "worker",
  ADMIN: "admin",
};

// Job categories
export const JOB_CATEGORIES = [
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Gardening",
  "Moving",
  "Handyman",
  "Cooking",
  "Pet Care",
  "Tutoring",
  "Photography",
  "Event Planning",
  "Other",
];

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Application statuses
export const APPLICATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

// Review ratings
export const REVIEW_RATINGS = [1, 2, 3, 4, 5];

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Default pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Theme options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM DD, YYYY",
  INPUT: "YYYY-MM-DD",
  DATETIME: "MMM DD, YYYY hh:mm A",
  TIME: "hh:mm A",
};

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: null },
];

// Sort options
export const SORT_OPTIONS = [
  { label: "Most Recent", value: "createdAt" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Distance", value: "distance" },
];

// Navigation items
export const NAVIGATION = {
  PUBLIC: [
    { label: "Home", path: "/" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Services", path: "/services" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact", path: "/contact" },
  ],
  CUSTOMER: [
    { label: "Dashboard", path: "/customer-home" },
    { label: "Find Workers", path: "/find-workers" },
    { label: "My Bookings", path: "/bookings" },
    { label: "My Reviews", path: "/reviews" },
    { label: "Profile", path: "/profile" },
  ],
  WORKER: [
    { label: "Dashboard", path: "/worker-home" },
    { label: "Find Jobs", path: "/find-jobs" },
    { label: "My Applications", path: "/job-applications" },
    { label: "My Reviews", path: "/reviews" },
    { label: "Profile", path: "/profile" },
  ],
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  WEAK_PASSWORD:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size exceeds limit",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Please log in to continue",
  FORBIDDEN: "You do not have permission to perform this action",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Server error. Please try again later.",
};
