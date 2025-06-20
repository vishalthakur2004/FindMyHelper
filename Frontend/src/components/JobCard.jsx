import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function JobCard({
  job,
  onApply,
  showActions = false,
  showOwnerActions = false,
}) {
  const { userInfo } = useSelector((state) => state.user);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    proposedAmount: job.budget || "",
    message: "",
  });

  const [isApplying, setIsApplying] = useState(false);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-green-100 text-green-800",
      assigned: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getUrgencyBadge = () => {
    const createdAt = new Date(job.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          🚨 Urgent
        </span>
      );
    } else if (hoursDiff < 168) {
      // 7 days
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          ⏰ This Week
        </span>
      );
    }
    return null;
  };

  const handleApplyClick = () => {
    if (!userInfo || userInfo.role !== "worker") {
      alert("Please login as a worker to apply for jobs");
      return;
    }
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async () => {
    if (!applicationData.message.trim()) {
      alert("Please provide a message with your application");
      return;
    }

    if (
      !applicationData.proposedAmount ||
      parseFloat(applicationData.proposedAmount) <= 0
    ) {
      alert("Please provide a valid proposed amount");
      return;
    }

    setIsApplying(true);
    try {
      await onApply(job._id, applicationData);
      setShowApplicationForm(false);
      setApplicationData({ proposedAmount: job.budget || "", message: "" });
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const hasApplied = job.applications?.some(
    (app) =>
      app.workerId?._id === userInfo?._id || app.workerId === userInfo?._id,
  );

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            {getUrgencyBadge()}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="font-medium text-blue-600">
              {job.serviceCategory?.charAt(0).toUpperCase() +
                job.serviceCategory?.slice(1).replace("-", " ")}
            </span>
            <span>•</span>
            <span className="font-semibold text-green-600">₹{job.budget}</span>
            {job.distance && (
              <>
                <span>•</span>
                <span>{formatDistance(job.distance)}</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Posted by:{" "}
            {job.customer?.fullName || job.customerId?.fullName || "Customer"}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
        >
          {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
        </span>
      </div>

        {job.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-700">{job.description}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">📍</span>
          <span>
            {job.address?.street && `${job.address.street}, `}
            {job.address?.city}, {job.address?.state}
            {job.address?.pincode && ` - ${job.address.pincode}`}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">📅</span>
          <span>Posted {formatDate(job.createdAt)}</span>
        </div>
        {job.applications && job.applications.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">👥</span>
            <span>{job.applications.length} applications received</span>
          </div>
        )}
      </div>

      {/* Application Form */}
      {showApplicationForm && (
        <div className="border-t pt-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-3">Apply for this job</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your proposed amount (₹)
              </label>
              <input
                type="number"
                value={applicationData.proposedAmount}
                onChange={(e) =>
                  setApplicationData((prev) => ({
                    ...prev,
                    proposedAmount: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your rate"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message to customer
              </label>
              <textarea
                value={applicationData.message}
                onChange={(e) =>
                  setApplicationData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Explain why you're the right person for this job..."
                maxLength="500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitApplication}
                disabled={isApplying}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                onClick={() => setShowApplicationForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && job.status === "open" && (
        <div className="space-y-2">
          {hasApplied ? (
            <div className="text-center py-2">
              <span className="text-green-600 font-medium">
                ✓ Application submitted
              </span>
            </div>
            ) : (
            <Button
              onClick={handleApplyClick}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Apply for Job
            </Button>
          )}
          </div>
      )}

      {/* Owner Actions for My Job Posts */}
      {showOwnerActions && (
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Applications</h4>
            <span className="text-sm text-gray-600">
              {job.applications?.length || 0} received
            </span>
          </div>
            {job.applications && job.applications.length > 0 ? (
            <div className="space-y-3">
              {job.applications.slice(0, 3).map((application) => (
                <div key={application._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.workerId?.fullName || "Worker"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {application.workerId?.profession} • ₹
                        {application.proposedAmount}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {application.message}
                  </p>
                  {application.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
                ))}
                {job.applications.length > 3 && (
                  <p className="text-sm text-gray-600 text-center">
                    +{job.applications.length - 3} more applications
                  </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">
              No applications yet
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export default JobCard;