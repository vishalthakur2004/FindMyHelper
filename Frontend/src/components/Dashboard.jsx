import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import JobPostForm from "./JobPostForm";
import JobList from "./JobList";
import JobSearch from "./JobSearch";
import WorkerList from "./WorkerList";
import BookingList from "./BookingList";
import { fetchMyJobPosts } from "../features/jobSlice";
import {
  fetchWorkerBookings,
  fetchCustomerBookings,
} from "../features/bookingSlice";

function Dashboard() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("browse");
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === "customer") {
        setActiveTab("browse");
        dispatch(fetchCustomerBookings());
      } else if (userInfo.role === "worker") {
        setActiveTab("jobs");
        dispatch(fetchWorkerBookings());
      }
    }
  }, [userInfo, dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Fetch relevant data when switching tabs
    if (tab === "my-jobs" && userInfo?.role === "customer") {
      dispatch(fetchMyJobPosts());
    } else if (tab === "bookings") {
      if (userInfo?.role === "customer") {
        dispatch(fetchCustomerBookings());
      } else if (userInfo?.role === "worker") {
        dispatch(fetchWorkerBookings());
      }
    }
  };

  const handleJobPostSuccess = (job) => {
    setShowJobForm(false);
    setActiveTab("my-jobs");
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-4">
            You need to be logged in to access the dashboard
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const customerTabs = [
    { id: "browse", label: "Browse Jobs", icon: "🔍" },
    { id: "workers", label: "Find Workers", icon: "👷" },
    { id: "my-jobs", label: "My Job Posts", icon: "📝" },
    { id: "bookings", label: "My Bookings", icon: "📅" },
  ];

  const workerTabs = [
    { id: "jobs", label: "Available Jobs", icon: "🔍" },
    { id: "bookings", label: "My Bookings", icon: "📅" },
  ];

  const tabs = userInfo.role === "customer" ? customerTabs : workerTabs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userInfo.role === "customer" ? "Customer" : "Worker"} Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {userInfo.fullName}!
              </p>
            </div>

            {userInfo.role === "customer" && (
              <Button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Post a Job
              </Button>
            )}
          </div>
        </div>

        {/* Job Post Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4">Post a New Job</h2>
              <JobPostForm
                onSubmit={handleJobPostSuccess}
                onCancel={() => setShowJobForm(false)}
              />
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Browse Jobs (Customer) or Available Jobs (Worker) */}
          {(activeTab === "browse" || activeTab === "jobs") && (
            <div className="space-y-6">
              <JobSearch />
              <JobList
                showMyJobs={false}
                filters={{}} // Filters will come from JobSearch component
              />
            </div>
          )}

          {/* Find Workers (Customer only) */}
          {activeTab === "workers" && userInfo.role === "customer" && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Find Workers Near You
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover skilled workers in your area and book their services
                  directly.
                </p>
              </Card>
              <WorkerList filters={{}} />
            </div>
          )}

          {/* My Job Posts (Customer only) */}
          {activeTab === "my-jobs" && userInfo.role === "customer" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Job Posts
                </h2>
                <Button
                  onClick={() => setShowJobForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  + Post New Job
                </Button>
              </div>
              <JobList showMyJobs={true} />
            </div>
          )}

          {/* Bookings */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {userInfo.role === "customer"
                  ? "My Bookings"
                  : "Service Requests"}
              </h2>
              <BookingList userRole={userInfo.role} />
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userInfo.role === "customer"
                    ? "Jobs Posted"
                    : "Jobs Applied"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">Bookings</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userInfo.rating ? userInfo.rating.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;