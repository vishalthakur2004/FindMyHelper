import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import JobCard from "../components/JobCard";
import BookingCard from "../components/BookingCard";
import SearchWorkers from "../components/SearchWorkers";
import JobPostForm from "../components/JobPostForm";
import { fetchCustomerBookings } from "../features/bookingSlice";
import { fetchMyJobPosts } from "../features/jobSlice";

function CustomerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const { customerBookings, loading: bookingLoading } = useSelector(
    (state) => state.bookings,
  );
  const { myJobPosts, loading: jobLoading } = useSelector(
    (state) => state.jobs,
  );
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [showJobPostForm, setShowJobPostForm] = useState(false);

  useEffect(() => {
    // Initialize customer data when component mounts
    if (user?.role === "customer") {
      dispatch(fetchCustomerBookings());
      dispatch(fetchMyJobPosts());
    }
  }, [user, dispatch]);

  // Access control
  if (user && user.role !== "customer") {
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
              This page is only accessible to customers. You are currently
              logged in as a {user.role}.
            </p>
            <Button
              onClick={() =>
                (window.location.href =
                  user.role === "worker" ? "/worker-home" : "/")
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to {user.role === "worker" ? "Worker" : "Home"} Page
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
              You need to be logged in as a customer to access this page.
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

  const getBookingStats = () => {
    if (!customerBookings) return { pending: 0, active: 0, completed: 0 };

    return {
      pending: customerBookings.filter((b) => b.status === "pending").length,
      active: customerBookings.filter((b) =>
        ["accepted", "in-progress"].includes(b.status),
      ).length,
      completed: customerBookings.filter((b) =>
        ["completed", "confirmed"].includes(b.status),
      ).length,
    };
  };

  const getJobStats = () => {
    if (!myJobPosts) return { open: 0, assigned: 0, completed: 0 };

    return {
      open: myJobPosts.filter((j) => j.status === "open").length,
      assigned: myJobPosts.filter((j) => j.status === "assigned").length,
      completed: myJobPosts.filter((j) => j.status === "completed").length,
    };
  };

  const bookingStats = getBookingStats();
  const jobStats = getJobStats();

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Quick Actions */}
      <div className="quick-actions grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSection("find-workers")}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👷</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Find Workers
              </h3>
              <p className="action-description text-sm text-gray-600">
                Book skilled workers near you
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setShowJobPostForm(true)}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Post a Job
              </h3>
              <p className="action-description text-sm text-gray-600">
                Get multiple quotes from workers
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="action-card p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSection("bookings")}
        >
          <div className="action-content flex items-center">
            <div className="action-icon p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="action-info ml-4">
              <h3 className="action-title font-semibold text-gray-900">
                Manage Bookings
              </h3>
              <p className="action-description text-sm text-gray-600">
                View and manage your bookings
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="recent-activities grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Bookings */}
        <Card className="recent-bookings-card p-6">
          <div className="card-header flex justify-between items-center mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("bookings")}
            >
              View All
            </Button>
          </div>

          {bookingLoading.customerBookings ? (
            <div className="loading-state text-center py-4">
              <div className="loading-spinner animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : customerBookings && customerBookings.length > 0 ? (
            <div className="bookings-list space-y-3">
              {customerBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="booking-item p-3 bg-gray-50 rounded-lg"
                >
                  <div className="booking-summary flex justify-between items-center">
                    <div className="booking-details">
                      <p className="booking-service font-medium text-gray-900">
                        {booking.serviceCategory?.charAt(0).toUpperCase() +
                          booking.serviceCategory?.slice(1).replace("-", " ")}
                      </p>
                      <p className="booking-worker text-sm text-gray-600">
                        {booking.workerId?.fullName} • ₹{booking.amount}
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
              <span className="empty-icon text-4xl mb-2 block">📅</span>
              <p className="empty-message">No bookings yet</p>
              <Button
                className="mt-2"
                size="sm"
                onClick={() => setActiveSection("find-workers")}
              >
                Book a Worker
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Job Posts */}
        <Card className="recent-jobs-card p-6">
          <div className="card-header flex justify-between items-center mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              My Job Posts
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSection("my-jobs")}
            >
              View All
            </Button>
          </div>

          {jobLoading.myJobPosts ? (
            <div className="loading-state text-center py-4">
              <div className="loading-spinner animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : myJobPosts && myJobPosts.length > 0 ? (
            <div className="jobs-list space-y-3">
              {myJobPosts.slice(0, 3).map((job) => (
                <div
                  key={job._id}
                  className="job-item p-3 bg-gray-50 rounded-lg"
                >
                  <div className="job-summary flex justify-between items-center">
                    <div className="job-details">
                      <p className="job-title font-medium text-gray-900">
                        {job.title}
                      </p>
                      <p className="job-meta text-sm text-gray-600">
                        {job.serviceCategory} • ₹{job.budget}
                      </p>
                    </div>
                    <div className="job-info text-right">
                      <span
                        className={`job-status px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : job.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status}
                      </span>
                      <p className="applications-count text-xs text-gray-500 mt-1">
                        {job.applications?.length || 0} applications
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-8 text-gray-500">
              <span className="empty-icon text-4xl mb-2 block">📝</span>
              <p className="empty-message">No job posts yet</p>
              <Button
                className="mt-2"
                size="sm"
                onClick={() => setShowJobPostForm(true)}
              >
                Post a Job
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  return (
    <div className="customer-home min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="page-header bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="header-content flex items-center justify-between">
            <div className="header-info">
              <h1 className="page-title text-2xl font-bold text-gray-900">
                Welcome back, {user.fullName}!
              </h1>
              <p className="page-subtitle text-gray-600">
                Manage your service bookings and job posts
              </p>
            </div>

            <div className="header-stats flex gap-6">
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-blue-600">
                  {bookingStats.active}
                </div>
                <div className="stat-label text-sm text-gray-600">
                  Active Bookings
                </div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-green-600">
                  {jobStats.open}
                </div>
                <div className="stat-label text-sm text-gray-600">
                  Open Jobs
                </div>
              </div>
              <div className="stat-item text-center">
                <div className="stat-value text-2xl font-bold text-purple-600">
                  {bookingStats.completed + jobStats.completed}
                </div>
                <div className="stat-label text-sm text-gray-600">
                  Completed
                </div>
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
              { id: "find-workers", label: "Find Workers", icon: "👷" },
              { id: "my-jobs", label: "My Job Posts", icon: "📝" },
              { id: "bookings", label: "My Bookings", icon: "📅" },
              { id: "reviews", label: "Reviews", icon: "⭐" },
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

        {activeSection === "find-workers" && <SearchWorkers />}

        {activeSection === "my-jobs" && (
          <div className="my-jobs-section">
            <div className="section-header flex justify-between items-center mb-6">
              <div>
                <h2 className="section-title text-2xl font-bold text-gray-900">
                  My Job Posts
                </h2>
                <p className="section-description text-gray-600">
                  Manage your posted jobs and applications
                </p>
              </div>
              <Button
                onClick={() => setShowJobPostForm(true)}
                className="post-job-button bg-blue-600 hover:bg-blue-700 text-white"
              >
                Post New Job
              </Button>
            </div>

            {jobLoading.myJobPosts ? (
              <div className="loading-state text-center py-12">
                <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="loading-text text-gray-600">
                  Loading your job posts...
                </p>
              </div>
            ) : myJobPosts && myJobPosts.length > 0 ? (
              <div className="jobs-grid space-y-6">
                {myJobPosts.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    userRole="customer"
                    onEdit={(job) => console.log("Edit job:", job)}
                    onViewApplications={(job) =>
                      console.log("View applications:", job)
                    }
                    showApplicationButton={false}
                  />
                ))}
              </div>
            ) : (
              <Card className="empty-state p-12 text-center">
                <div className="empty-icon text-6xl mb-4">📝</div>
                <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
                  No Job Posts Yet
                </h3>
                <p className="empty-message text-gray-600 mb-4">
                  Start by posting your first job to get quotes from skilled
                  workers.
                </p>
                <Button onClick={() => setShowJobPostForm(true)}>
                  Post Your First Job
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeSection === "bookings" && (
          <div className="bookings-section">
            <div className="section-header mb-6">
              <h2 className="section-title text-2xl font-bold text-gray-900">
                My Bookings
              </h2>
              <p className="section-description text-gray-600">
                Track and manage your service bookings
              </p>
            </div>

            {bookingLoading.customerBookings ? (
              <div className="loading-state text-center py-12">
                <div className="loading-spinner animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="loading-text text-gray-600">
                  Loading your bookings...
                </p>
              </div>
            ) : customerBookings && customerBookings.length > 0 ? (
              <div className="bookings-grid space-y-6">
                {customerBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    userRole="customer"
                    onViewDetails={(booking) =>
                      console.log("View booking details:", booking)
                    }
                  />
                ))}
              </div>
            ) : (
              <Card className="empty-state p-12 text-center">
                <div className="empty-icon text-6xl mb-4">📅</div>
                <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
                  No Bookings Yet
                </h3>
                <p className="empty-message text-gray-600 mb-4">
                  You haven't made any bookings yet. Find workers or post jobs
                  to get started.
                </p>
                <Button onClick={() => setActiveSection("find-workers")}>
                  Find Workers
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeSection === "reviews" && (
          <div className="reviews-section">
            <div className="section-header mb-6">
              <h2 className="section-title text-2xl font-bold text-gray-900">
                My Reviews
              </h2>
              <p className="section-description text-gray-600">
                Reviews you've given to workers
              </p>
            </div>

            <Card className="empty-state p-12 text-center">
              <div className="empty-icon text-6xl mb-4">⭐</div>
              <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
                No Reviews Yet
              </h3>
              <p className="empty-message text-gray-600 mb-4">
                Complete some bookings to start leaving reviews for workers.
              </p>
              <Button onClick={() => setActiveSection("bookings")}>
                View Bookings
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Job Post Form Modal */}
      {showJobPostForm && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-content w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <JobPostForm
              onSuccess={(job) => {
                setShowJobPostForm(false);
                dispatch(fetchMyJobPosts());
                alert("Job posted successfully!");
              }}
              onCancel={() => setShowJobPostForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerHomePage;
