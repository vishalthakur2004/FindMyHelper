import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import JobSearch from "../components/JobSearch";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

function WorkerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  useEffect(() => {
    fetchNearbyJobs();
    fetchCurrentBookings();
  }, []);

  const fetchNearbyJobs = async () => {
    try {
      const response = await axios.get("/api/v1/jobs/nearby", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          profession: user?.profession,
          radius: 10000, // 10km radius
        },
      });
      setNearbyJobs(response.data.jobs || []);
      setFilteredJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching nearby jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentBookings = async () => {
    try {
      const response = await axios.get("/api/v1/bookings/worker/current", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCurrentBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching current bookings:", error);
    }
  };

  const handleJobSearch = (searchFilters) => {
    let filtered = nearbyJobs;

    if (searchFilters.budget) {
      filtered = filtered.filter(
        (job) =>
          job.budget >= searchFilters.budget.min &&
          job.budget <= searchFilters.budget.max,
      );
    }

    if (searchFilters.location) {
      filtered = filtered.filter(
        (job) =>
          job.address.city
            .toLowerCase()
            .includes(searchFilters.location.toLowerCase()) ||
          job.address.pincode.includes(searchFilters.location),
      );
    }

    if (searchFilters.urgency) {
      const now = new Date();
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.createdAt);
        const diffHours = (now - jobDate) / (1000 * 60 * 60);

        if (searchFilters.urgency === "urgent") return diffHours <= 24;
        if (searchFilters.urgency === "this-week") return diffHours <= 168;
        return true;
      });
    }

    setFilteredJobs(filtered);
  };

  const handleApplyJob = async (jobId, proposedAmount, message) => {
    try {
      await axios.post(
        `/api/v1/jobs/${jobId}/apply`,
        {
          proposedAmount,
          message,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      // Refresh jobs after application
      fetchNearbyJobs();
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `/api/v1/bookings/${bookingId}/status`,
        {
          status,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      fetchCurrentBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
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
            {user?.profession} • {currentBookings.length} active bookings
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "available"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Available Jobs ({filteredJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "current"
                ? "bg-blue-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Current Work ({currentBookings.length})
          </button>
        </div>

        {activeTab === "available" && (
          <div>
            {/* Job Search Section */}
            <div className="mb-6">
              <JobSearch onSearch={handleJobSearch} />
            </div>

            {/* Available Jobs */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Jobs Near You
              </h2>

              {filteredJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    No jobs available in your area at the moment.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try expanding your search radius or check back later.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onApply={handleApplyJob}
                      userType="worker"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "current" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Current Work
            </h2>

            {currentBookings.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No current bookings.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Apply for jobs to start earning!
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentBookings.map((booking) => (
                  <Card key={booking._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.serviceCategory}
                        </h3>
                        <p className="text-gray-600">
                          Customer: {booking.customerId?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Scheduled:{" "}
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "accepted"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status.replace("_", " ").toUpperCase()}
                        </span>
                        <p className="text-lg font-semibold mt-1">
                          ₹{booking.amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {booking.status === "accepted" && (
                        <Button
                          onClick={() =>
                            updateBookingStatus(booking._id, "in_progress")
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start Work
                        </Button>
                      )}
                      {booking.status === "in_progress" && (
                        <Button
                          onClick={() =>
                            updateBookingStatus(booking._id, "completed")
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      )}
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

export default WorkerHomePage;