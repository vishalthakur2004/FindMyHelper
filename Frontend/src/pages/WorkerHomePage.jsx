import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import JobCard from "../components/JobCard";
import BookingCard from "../components/BookingCard";
import { fetchWorkerBookings } from "../features/bookingSlice";
import { fetchNearbyJobs } from "../features/jobSlice";

function WorkerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const {
    workerBookings,
    loading: bookingLoading,
    error: bookingError,
  } = useSelector((state) => state.bookings);
  const {
    nearbyJobs,
    loading: jobLoading,
    error: jobError,
  } = useSelector((state) => state.jobs);

  const [activeSection, setActiveSection] = useState("dashboard");
  const [jobFilters, setJobFilters] = useState({
    serviceCategory: user?.profession || "",
    sortBy: "newest",
    budget: { min: "", max: "" },
  });

  useEffect(() => {
    if (user?.role === "worker") {
      dispatch(fetchWorkerBookings());
      dispatch(fetchNearbyJobs(jobFilters));
    }
  }, [user, dispatch]);

  // Access control
  if (user && user.role !== "worker") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-4">
              <span className="text-6xl">🚫</span>
            </div>
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">
              This page is only accessible to workers. You are currently logged
              in as a {user.role}.
            </p>
            <Button
              onClick={() =>
                (window.location.href =
                  user.role === "customer" ? "/customer-home" : "/")
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to {user.role === "customer" ? "Customer" : "Home"} Page
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center max-w-md">
            <div className="mb-4">
              <span className="text-6xl">🔒</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600 mb-4">
              You need to be logged in as a worker to access this page.
            </p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Helper functions
  const getBookingStats = () => {
    if (!workerBookings)
      return { pending: 0, active: 0, completed: 0, earnings: 0 };

    const stats = {
      pending: workerBookings.filter((b) => b.status === "pending").length,
      active: workerBookings.filter((b) =>
        ["accepted", "in-progress"].includes(b.status),
      ).length,
      completed: workerBookings.filter((b) =>
        ["completed", "confirmed"].includes(b.status),
      ).length,
      earnings: workerBookings
        .filter((b) => b.status === "confirmed")
        .reduce((total, booking) => total + (booking.amount || 0), 0),
    };

    return stats;
  };

  const handleJobFilterChange = (key, value) => {
    const newFilters = { ...jobFilters, [key]: value };
    setJobFilters(newFilters);
    dispatch(fetchNearbyJobs(newFilters));
  };

  const bookingStats = getBookingStats();

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Quick Stats */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card p-6 text-center">
          <div className="stat-value text-3xl font-bold text-orange-600">
            {bookingStats.pending}
          </div>
          <div className="stat-label text-sm text-gray-600">
            Pending Requests
          </div>
        </Card>
        <Card className="stat-card p-6 text-center">
          <div className="stat-value text-3xl font-bold text-blue-600">
            {bookingStats.active}
          </div>
          <div className="stat-label text-sm text-gray-600">Active Jobs</div>
        </Card>
        <Card className="stat-card p-6 text-center">
          <div className="stat-value text-3xl font-bold text-green-600">
            {bookingStats.completed}
          </div>
          <div className="stat-label text-sm text-gray-600">Completed Jobs</div>
        </Card>
        <Card className="stat-card p-6 text-center">
          <div className="stat-value text-3xl font-bold text-purple-600">
            ₹{bookingStats.earnings}
          </div>
          <div className="stat-label text-sm text-gray-600">Total Earnings</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSection("find-jobs")}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Find New Jobs
              </h3>
              <p className="action-description text-sm text-gray-600">
                Browse and apply for posted jobs
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSection("bookings")}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Manage Bookings
              </h3>
              <p className="action-description text-sm text-gray-600">
                View and respond to booking requests
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSection("profile")}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👤</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Update Profile
              </h3>
              <p className="action-description text-sm text-gray-600">
                Manage availability and skills
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="recent-bookings-card p-6">
          <div className="card-header flex justify-between items-center mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              Recent Booking Requests
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("bookings")}
            >
              View All
            </Button>
          </div>

          {bookingLoading.workerBookings ? (
            <div className="loading-state text-center py-4">
              <div className="loading-spinner animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : bookingError.workerBookings ? (
            <div className="error-state text-center py-4 text-red-600">
              <p>Failed to load bookings</p>
            </div>
          ) : workerBookings && workerBookings.length > 0 ? (
            <div className="bookings-list space-y-3">
              {workerBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="booking-item p-3 bg-gray-50 rounded-lg"
                >
                  <div className="booking-summary flex justify-between items-center">
                    <div className="booking-details">
                      <p className="booking-service font-medium text-gray-900">
                        {booking.serviceCategory
                          ?.replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="booking-customer text-sm text-gray-600">
                        {booking.customerId?.fullName} • ₹{booking.amount}
                      </p>
                    </div>
                    <span
                      className={`booking-status px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "accepted"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-8 text-gray-500">
              <span className="empty-icon text-4xl mb-2 block">📭</span>
              <p className="empty-message">No booking requests yet</p>
              <Button
                className="mt-2"
                size="sm"
                onClick={() => setActiveSection("find-jobs")}
              >
                Find Jobs
              </Button>
            </div>
          )}
        </Card>

        {/* Available Jobs */}
        <Card className="available-jobs-card p-6">
          <div className="card-header flex justify-between items-center mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              New Job Opportunities
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("find-jobs")}
            >
              View All
            </Button>
          </div>

          {jobLoading.nearbyJobs ? (
            <div className="loading-state text-center py-4">
              <div className="loading-spinner animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : jobError.nearbyJobs ? (
            <div className="error-state text-center py-4 text-red-600">
              <p>Failed to load jobs</p>
            </div>
          ) : nearbyJobs && nearbyJobs.length > 0 ? (
            <div className="jobs-list space-y-3">
              {nearbyJobs.slice(0, 3).map((job) => (
                <div
                  key={job._id}
                  className="job-item p-3 bg-gray-50 rounded-lg"
                >
                  <div className="job-summary">
                    <p className="job-title font-medium text-gray-900 line-clamp-1">
                      {job.title}
                    </p>
                    <p className="job-details text-sm text-gray-600">
                      {job.serviceCategory?.replace("-", " ")} • ₹{job.budget}
                    </p>
                    <div className="job-actions mt-2">
                      <Button
                        size="sm"
                        onClick={() => setActiveSection("find-jobs")}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-8 text-gray-500">
              <span className="empty-icon text-4xl mb-2 block">💼</span>
              <p className="empty-message">No jobs found in your category</p>
              <Button
                className="mt-2"
                size="sm"
                onClick={() => handleJobFilterChange("serviceCategory", "")}
              >
                Browse All Jobs
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  const renderFindJobs = () => (
    <div className="find-jobs-content">
      <div className="section-header mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900 mb-2">
          Available Jobs
        </h2>
        <p className="section-description text-gray-600">
          Browse and apply for jobs that match your skills
        </p>
      </div>

      {/* Job Filters */}
      <Card className="filters-card p-4 mb-6">
        <div className="filters-grid grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="category-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={jobFilters.serviceCategory}
              onChange={(e) =>
                handleJobFilterChange("serviceCategory", e.target.value)
              }
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="painting">Painting</option>
              <option value="carpentry">Carpentry</option>
              <option value="gardening">Gardening</option>
              <option value="handyman">Handyman</option>
            </select>
          </div>

          <div className="budget-min-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Min Budget
            </label>
            <input
              type="number"
              value={jobFilters.budget.min}
              onChange={(e) =>
                handleJobFilterChange("budget", {
                  ...jobFilters.budget,
                  min: e.target.value,
                })
              }
              placeholder="₹0"
              className="filter-input w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="budget-max-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Max Budget
            </label>
            <input
              type="number"
              value={jobFilters.budget.max}
              onChange={(e) =>
                handleJobFilterChange("budget", {
                  ...jobFilters.budget,
                  max: e.target.value,
                })
              }
              placeholder="₹10000"
              className="filter-input w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="sort-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={jobFilters.sortBy}
              onChange={(e) => handleJobFilterChange("sortBy", e.target.value)}
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="newest">Newest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="urgent">Most Urgent</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Jobs List */}
      {jobLoading.nearbyJobs ? (
        <div className="loading-state text-center py-12">
          <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="loading-text text-gray-600">
            Loading available jobs...
          </p>
        </div>
      ) : jobError.nearbyJobs ? (
        <Card className="error-state p-8 text-center">
          <div className="error-icon text-4xl mb-2">⚠️</div>
          <h3 className="error-title text-lg font-semibold text-red-600 mb-2">
            Failed to Load Jobs
          </h3>
          <p className="error-message text-gray-600 mb-4">
            {jobError.nearbyJobs}
          </p>
          <Button onClick={() => dispatch(fetchNearbyJobs(jobFilters))}>
            Try Again
          </Button>
        </Card>
      ) : nearbyJobs && nearbyJobs.length > 0 ? (
        <div className="jobs-grid space-y-6">
          {nearbyJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              userRole="worker"
              showApplicationButton={true}
            />
          ))}
        </div>
      ) : (
        <Card className="empty-state p-12 text-center">
          <div className="empty-icon text-6xl mb-4">🔍</div>
          <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
            No Jobs Found
          </h3>
          <p className="empty-message text-gray-600 mb-4">
            No jobs match your current filters. Try adjusting your search
            criteria.
          </p>
          <Button
            onClick={() =>
              setJobFilters({
                serviceCategory: "",
                sortBy: "newest",
                budget: { min: "", max: "" },
              })
            }
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="bookings-content">
      <div className="section-header mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900 mb-2">
          My Bookings
        </h2>
        <p className="section-description text-gray-600">
          Manage your booking requests and ongoing jobs
        </p>
      </div>

      {bookingLoading.workerBookings ? (
        <div className="loading-state text-center py-12">
          <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="loading-text text-gray-600">Loading your bookings...</p>
        </div>
      ) : bookingError.workerBookings ? (
        <Card className="error-state p-8 text-center">
          <div className="error-icon text-4xl mb-2">⚠️</div>
          <h3 className="error-title text-lg font-semibold text-red-600 mb-2">
            Failed to Load Bookings
          </h3>
          <p className="error-message text-gray-600 mb-4">
            {bookingError.workerBookings}
          </p>
          <Button onClick={() => dispatch(fetchWorkerBookings())}>
            Try Again
          </Button>
        </Card>
      ) : workerBookings && workerBookings.length > 0 ? (
        <div className="bookings-grid space-y-6">
          {workerBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              userRole="worker"
              onViewDetails={(booking) =>
                setActiveSection(`booking-${booking._id}`)
              }
            />
          ))}
        </div>
      ) : (
        <Card className="empty-state p-12 text-center">
          <div className="empty-icon text-6xl mb-4">📭</div>
          <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
            No Bookings Yet
          </h3>
          <p className="empty-message text-gray-600 mb-4">
            You haven't received any booking requests yet. Keep applying for
            jobs to get started!
          </p>
          <Button onClick={() => setActiveSection("find-jobs")}>
            Find Jobs
          </Button>
        </Card>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-content">
      <div className="section-header mb-6">
        <h2 className="section-title text-2xl font-bold text-gray-900 mb-2">
          Profile & Settings
        </h2>
        <p className="section-description text-gray-600">
          Manage your professional profile and availability
        </p>
      </div>

      <div className="profile-sections grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="profile-info-card p-6">
          <h3 className="card-title text-lg font-semibold text-gray-900 mb-4">
            Profile Information
          </h3>
          <div className="profile-details space-y-4">
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="detail-value text-gray-900">{user.fullName}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Profession
              </label>
              <p className="detail-value text-gray-900 capitalize">
                {user.profession?.replace("-", " ")}
              </p>
            </div>
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="detail-value text-gray-900">{user.phoneNumber}</p>
            </div>
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Experience
              </label>
              <p className="detail-value text-gray-900">
                {user.experience || "Not specified"} years
              </p>
            </div>
            <Button className="edit-profile-button bg-blue-600 hover:bg-blue-700 text-white">
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card className="availability-card p-6">
          <h3 className="card-title text-lg font-semibold text-gray-900 mb-4">
            Availability & Rates
          </h3>
          <div className="availability-details space-y-4">
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Hourly Rate
              </label>
              <p className="detail-value text-gray-900">
                ₹{user.hourlyRate || "Not set"}/hour
              </p>
            </div>
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Current Status
              </label>
              <p className="detail-value text-green-600 font-medium">
                Available for work
              </p>
            </div>
            <div className="detail-item">
              <label className="detail-label text-sm font-medium text-gray-500">
                Working Hours
              </label>
              <p className="detail-value text-gray-900">9:00 AM - 6:00 PM</p>
            </div>
            <Button variant="outline" className="update-availability-button">
              Update Availability
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="worker-home min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="page-header bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="header-content flex items-center justify-between">
            <div className="header-info">
              <h1 className="page-title text-3xl font-bold text-gray-900">
                Welcome back, {user.fullName}!
              </h1>
              <p className="page-subtitle text-gray-600">
                Manage your jobs, bookings, and professional profile
              </p>
            </div>

            <div className="header-stats flex gap-6">
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-orange-600">
                  {bookingStats.pending}
                </div>
                <div className="stat-label text-sm text-gray-600">Pending</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-blue-600">
                  {bookingStats.active}
                </div>
                <div className="stat-label text-sm text-gray-600">Active</div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-green-600">
                  ₹{bookingStats.earnings}
                </div>
                <div className="stat-label text-sm text-gray-600">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="navigation-tabs bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="tab-nav flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: "🏠" },
              { id: "find-jobs", label: "Find Jobs", icon: "🔍" },
              { id: "bookings", label: "My Bookings", icon: "📅" },
              { id: "profile", label: "Profile", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`tab-button flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeSection === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "find-jobs" && renderFindJobs()}
        {activeSection === "bookings" && renderBookings()}
        {activeSection === "profile" && renderProfile()}
      </div>
    </div>
  );
}

export default WorkerHomePage;
