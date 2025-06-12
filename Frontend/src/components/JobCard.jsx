import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { deleteJob } from "../features/jobSlice";

function JobCard({
  job,
  onApply,
  showActions = false,
  showOwnerActions = false,
}) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.jobs);

  const [isApplying, setIsApplying] = useState(false);
  const [proposedAmount, setProposedAmount] = useState(job.budget || "");
  const [message, setMessage] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!proposedAmount || !message.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsApplying(true);
    try {
      if (onApply) {
        await onApply(job._id);
      }
      setMessage("");
      setProposedAmount(job.budget || "");
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      try {
        const result = await dispatch(deleteJob(job._id));
        if (deleteJob.fulfilled.match(result)) {
          alert("Job post deleted successfully");
        } else {
          alert(result.payload || "Failed to delete job post");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job post");
      }
    }
  };
  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const hasApplied =
    job.applications?.some((app) => app.workerId === userInfo?._id) ||
    job.hasApplied;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {job.serviceCategory}
            </span>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              📍 {job.address?.city}, {job.address?.pincode}
            </span>
            {job.distance && <span>{formatDistance(job.distance)}</span>}
            <span>{getTimeAgo(job.createdAt)}</span>
          </div>
        </div>

        <div className="text-right ml-4">
          <div className="text-2xl font-bold text-green-600 mb-1">
            ₹{job.budget?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {job.applications?.length || 0} applications
          </div>
        </div>
      </div>

      {showActions && !hasApplied && (
        <div className="border-t pt-4">
          <form onSubmit={handleApply}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rate (₹)
                </label>
                <input
                  type="number"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your rate"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief message to customer"
                  maxLength="100"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Customer budget: ₹{job.budget?.toLocaleString()}
              </div>
              <Button
                type="submit"
                disabled={isApplying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {hasApplied && (
        <div className="border-t pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center">
              <div className="text-blue-800 text-sm font-medium">
                ✓ You have already applied for this job
              </div>
            </div>
          </div>
        </div>
      )}

      {showOwnerActions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
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
              {job.status?.toUpperCase() || "OPEN"}
            </span>

            <div className="flex items-center gap-2">
              {job.applications && job.applications.length > 0 && (
                <div className="text-sm text-gray-600">
                  {job.applications.length} worker
                  {job.applications.length !== 1 ? "s" : ""} applied
                </div>
              )}

              <Button
                onClick={handleDeleteJob}
                disabled={loading.deleting}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                {loading.deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!showActions && !showOwnerActions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
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
              {job.status?.toUpperCase() || "OPEN"}
            </span>

            {job.applications && job.applications.length > 0 && (
              <div className="text-sm text-gray-600">
                {job.applications.length} worker
                {job.applications.length !== 1 ? "s" : ""} applied
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default JobCard;