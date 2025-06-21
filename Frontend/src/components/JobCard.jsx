import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { applyForJob, deleteJob } from "../features/jobSlice";

function JobCard({
  job,
  userRole,
  onEdit,
  onViewApplications,
  showApplicationButton = true,
}) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.jobs);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    proposedBudget: "",
    estimatedDuration: "",
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApplyForJob = async () => {
    if (!applicationData.coverLetter.trim()) {
      alert("Please provide a cover letter");
      return;
    }

    setIsApplying(true);
    try {
      const result = await dispatch(
        applyForJob({
          jobId: job._id,
          applicationData: {
            coverLetter: applicationData.coverLetter,
            proposedBudget: applicationData.proposedBudget || job.budget,
            estimatedDuration: applicationData.estimatedDuration,
          },
        }),
      );

      if (result.type === "jobs/applyForJob/fulfilled") {
        setShowApplicationForm(false);
        setApplicationData({
          coverLetter: "",
          proposedBudget: "",
          estimatedDuration: "",
        });
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      await dispatch(deleteJob(job._id));
    }
  };

  const canApply =
    userRole === "worker" &&
    job.status === "open" &&
    job.customerId !== userInfo?._id &&
    !job.hasApplied;

  const isOwner = userRole === "customer" && job.customerId === userInfo?._id;

  return (
    <Card className="job-card border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="card-header p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="job-title text-lg font-semibold text-gray-900 line-clamp-2">
            {job.title}
          </h3>
          <div className="status-badges flex gap-2">
            <span
              className={`status-badge px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
            >
              {job.status}
            </span>
            {job.urgency && (
              <span
                className={`urgency-badge px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(job.urgency)}`}
              >
                {job.urgency}
              </span>
            )}
          </div>
        </div>

        <div className="job-meta flex items-center gap-4 text-sm text-gray-600">
          <span className="service-category font-medium">
            {job.serviceCategory
              ?.replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
          <span className="budget text-green-600 font-semibold">
            ₹{job.budget}
          </span>
          <span className="post-date">{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="card-body p-4">
        <p className="job-description text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>

        <div className="job-details grid grid-cols-2 gap-4 mb-4 text-sm">
          {job.location && (
            <div className="location">
              <span className="label text-gray-500">Location:</span>
              <span className="value ml-1 text-gray-700">
                {job.location.address}
              </span>
            </div>
          )}
          {job.requirements?.length > 0 && (
            <div className="requirements">
              <span className="label text-gray-500">Skills:</span>
              <span className="value ml-1 text-gray-700">
                {job.requirements.slice(0, 2).join(", ")}
                {job.requirements.length > 2 && "..."}
              </span>
            </div>
          )}
        </div>

        {job.applications && job.applications.length > 0 && (
          <div className="applications-info mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              {job.applications.length} application
              {job.applications.length !== 1 ? "s" : ""} received
            </span>
          </div>
        )}

        {!showApplicationForm && (
          <div className="card-actions flex gap-2 flex-wrap">
            {/* Worker Actions */}
            {canApply && showApplicationButton && (
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="apply-button bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading.applying}
              >
                {loading.applying ? "Applying..." : "Apply Now"}
              </Button>
            )}

            {job.hasApplied && userRole === "worker" && (
              <Button variant="outline" disabled className="applied-button">
                Applied ✓
              </Button>
            )}

            {/* Customer Actions */}
            {isOwner && (
              <>
                {onViewApplications && job.applications?.length > 0 && (
                  <Button
                    onClick={() => onViewApplications(job)}
                    variant="outline"
                    className="view-applications-button"
                  >
                    View Applications ({job.applications.length})
                  </Button>
                )}

                {onEdit && job.status === "open" && (
                  <Button
                    onClick={() => onEdit(job)}
                    variant="outline"
                    className="edit-button"
                  >
                    Edit
                  </Button>
                )}

                <Button
                  onClick={handleDeleteJob}
                  variant="outline"
                  className="delete-button text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={loading.deleting}
                >
                  {loading.deleting ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}

            {/* View Details for all users */}
            <Button
              variant="outline"
              className="view-details-button"
              onClick={() => window.open(`/jobs/${job._id}`, "_blank")}
            >
              View Details
            </Button>
          </div>
        )}

        {/* Application Form */}
        {showApplicationForm && (
          <div className="application-form mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="form-title text-md font-semibold mb-3">
              Apply for this job
            </h4>

            <div className="form-fields space-y-3">
              <div className="cover-letter-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter *
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      coverLetter: e.target.value,
                    })
                  }
                  placeholder="Why are you the right person for this job?"
                  className="form-textarea w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row grid grid-cols-2 gap-3">
                <div className="budget-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Proposed Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={applicationData.proposedBudget}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        proposedBudget: e.target.value,
                      })
                    }
                    placeholder={job.budget}
                    className="form-input w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="duration-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={applicationData.estimatedDuration}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        estimatedDuration: e.target.value,
                      })
                    }
                    placeholder="e.g., 2 hours, 1 day"
                    className="form-input w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions flex gap-2 mt-4">
              <Button
                onClick={handleApplyForJob}
                disabled={isApplying || !applicationData.coverLetter.trim()}
                className="submit-application bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                onClick={() => setShowApplicationForm(false)}
                variant="outline"
                className="cancel-application"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default JobCard;
