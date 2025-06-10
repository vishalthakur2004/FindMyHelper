import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import JobPostForm from "../components/JobPostForm";
import WorkerCard from "../components/WorkerCard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

function CustomerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("find-workers");
  const [showJobPostForm, setShowJobPostForm] = useState(false);

  useEffect(() => {
    fetchNearbyWorkers();
    fetchMyJobs();
    fetchCurrentBookings();
  }, []);

  const fetchNearbyWorkers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/workers-nearby`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          radius: 10000, // 10km radius
        },
      });
      setNearbyWorkers(response.data.workers || []);
    } catch (error) {
      console.error("Error fetching nearby workers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/my-posts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMyJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching my jobs:", error);
    }
  };

  const fetchCurrentBookings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/customer-current`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCurrentBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching current bookings:", error);
    }
  };

  const handleJobPost = async (jobData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/jobs/create`, jobData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setShowJobPostForm(false);
      fetchMyJobs();
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job");
    }
  };

  const handleRequestWorker = async (
    workerId,
    serviceCategory,
    scheduledDate,
    amount,
  ) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings/request`,
        {
          workerId,
          serviceCategory,
          scheduledDate,
          amount,
          paymentMethod: "cash", // Default to cash
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      fetchCurrentBookings();
      alert("Worker requested successfully!");
    } catch (error) {
      console.error("Error requesting worker:", error);
      alert("Failed to request worker");
    }
  };

  const handleJobAction = async (jobId, applicationId, action) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/applications/${applicationId}`,
        {
          status: action,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      fetchMyJobs();
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Find skilled workers or manage your job posts
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("find-workers")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "find-workers"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Find Workers
          </button>
          <button
            onClick={() => setActiveTab("my-jobs")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "my-jobs"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Job Posts ({myJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("current-work")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "current-work"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Current Work ({currentBookings.length})
          </button>
        </div>

        {activeTab === "find-workers" && (
          <div>
            {/* Post Job Button */}
            <div className="mb-6">
              <Button
                onClick={() => setShowJobPostForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                + Post a Job
              </Button>
            </div>

            {/* Job Post Form Modal */}
            {showJobPostForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Post a New Job</h3>
                    <button
                      onClick={() => setShowJobPostForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <JobPostForm
                    onSubmit={handleJobPost}
                    onCancel={() => setShowJobPostForm(false)}
                  />
                </div>
              </div>
            )}

            {/* Nearby Workers */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Skilled Workers Near You
              </h2>

              {nearbyWorkers.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    No workers available in your area.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try posting a job to attract workers.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {nearbyWorkers.map((worker) => (
                    <WorkerCard
                      key={worker._id}
                      worker={worker}
                      onRequest={handleRequestWorker}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-jobs" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Job Posts
            </h2>

            {myJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">
                  You haven't posted any jobs yet.
                </p>
                <Button
                  onClick={() => setShowJobPostForm(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Post Your First Job
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myJobs.map((job) => (
                  <Card key={job._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.description}</p>
                        <p className="text-sm text-gray-500">
                          Category: {job.serviceCategory}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            job.status === "open"
                              ? "bg-green-100 text-green-800"
                              : job.status === "assigned"
                                ? "bg-blue-100 text-blue-800"
                                : job.status === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.status.toUpperCase()}
                        </span>
                        <p className="text-lg font-semibold mt-1">
                          ₹{job.budget}
                        </p>
                      </div>
                    </div>

                    {job.applications && job.applications.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">
                          Applications ({job.applications.length})
                        </h4>
                        <div className="space-y-2">
                          {job.applications.map((application) => (
                            <div
                              key={application._id}
                              className="flex justify-between items-center bg-gray-50 p-3 rounded"
                            >
                              <div>
                                <p className="font-medium">
                                  {application.workerId?.fullName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {application.message}
                                </p>
                                <p className="text-sm font-medium">
                                  Proposed: ₹{application.proposedAmount}
                                </p>
                              </div>
                              {application.status === "pending" && (
                                <div className="space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleJobAction(
                                        job._id,
                                        application._id,
                                        "accepted",
                                      )
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleJobAction(
                                        job._id,
                                        application._id,
                                        "rejected",
                                      )
                                    }
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {application.status !== "pending" && (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    application.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {application.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "current-work" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Current Work Status
            </h2>

            {currentBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No current bookings.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Book a worker to get started.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentBookings.map((booking) => (
                  <Card key={booking._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.serviceCategory}
                        </h3>
                        <p className="text-gray-600">
                          Worker: {booking.workerId?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Scheduled:{" "}
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "requested"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "accepted"
                                ? "bg-blue-100 text-blue-800"
                                : booking.status === "in_progress"
                                  ? "bg-purple-100 text-purple-800"
                                  : booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status.replace("_", " ").toUpperCase()}
                        </span>
                        <p className="text-lg font-semibold mt-1">
                          ₹{booking.amount}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerHomePage;