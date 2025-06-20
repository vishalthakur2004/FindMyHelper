import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
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

  useEffect(() => {
    // Initialize customer data when component mounts
    if (user?.role === "customer") {
      dispatch(fetchCustomerBookings());
      dispatch(fetchMyJobPosts());
    }
  }, [user, dispatch]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Quick Stats Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.fullName}!
              </h1>
              <p className="text-gray-600">
                Manage your service bookings and job posts
              </p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bookingStats.active}
                </div>
                <div className="text-sm text-gray-600">Active Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {jobStats.open}
                </div>
                <div className="text-sm text-gray-600">Open Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookingStats.completed + jobStats.completed}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveSection("workers")}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👷</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Find Workers</h3>
                <p className="text-sm text-gray-600">
                  Book skilled workers near you
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveSection("post-job")}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Post a Job</h3>
                <p className="text-sm text-gray-600">
                  Get multiple quotes from workers
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveSection("browse")}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-sm text-gray-600">
                  See all available opportunities
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
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
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : customerBookings && customerBookings.length > 0 ? (
              <div className="space-y-3">
                {customerBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.serviceCategory?.charAt(0).toUpperCase() +
                          booking.serviceCategory?.slice(1).replace("-", " ")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.workerId?.fullName} • ₹{booking.amount}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📅</span>
                <p>No bookings yet</p>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() => setActiveSection("workers")}
                >
                  Book a Worker
                </Button>
              </div>
            )}
          </Card>

          {/* Recent Job Posts */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
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
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : myJobPosts && myJobPosts.length > 0 ? (
              <div className="space-y-3">
                {myJobPosts.slice(0, 3).map((job) => (
                  <div
                    key={job._id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-600">
                        {job.serviceCategory} • ₹{job.budget}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === "open"
                            ? "bg-green-100 text-green-800"
                            : job.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {job.applications?.length || 0} applications
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📝</span>
                <p>No job posts yet</p>
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() => setActiveSection("post-job")}
                >
                  Post a Job
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Main Dashboard */}
      <Dashboard />
    </div>
  );
}

export default CustomerHomePage;