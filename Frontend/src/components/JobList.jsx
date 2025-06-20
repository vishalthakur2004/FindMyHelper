import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobCard from "./JobCard";
import { Button } from "./ui/button";
import { fetchNearbyJobs, applyForJob } from "../features/jobSlice";

function JobList({ showMyJobs = false }) {
  const dispatch = useDispatch();
  const { nearbyJobs, myJobPosts, loading, error, pagination, filters } =
    useSelector((state) => state.jobs);
  const { userInfo } = useSelector((state) => state.user);

  const jobs = showMyJobs ? myJobPosts : nearbyJobs;
  const isLoading = showMyJobs ? loading.myJobPosts : loading.nearbyJobs;
  const errorMessage = showMyJobs ? error.myJobPosts : error.nearbyJobs;

  useEffect(() => {
    if (!showMyJobs) {
      dispatch(fetchNearbyJobs(filters));
    }
  }, [dispatch, filters, showMyJobs]);

  const handleApplyForJob = async (jobId, applicationData) => {
    if (!userInfo) {
      alert("Please login to apply for jobs");
      return;
    }

    if (userInfo.role !== "worker") {
      alert("Only workers can apply for jobs");
      return;
    }

    try {
      const result = await dispatch(applyForJob({ jobId, applicationData }));
      if (applyForJob.fulfilled.match(result)) {
        alert("Application submitted successfully!");
      } else {
        alert(result.payload || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Failed to apply for job");
    }
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.pages) {
      const nextFilters = {
        ...filters,
        page: pagination.page + 1,
      };
      dispatch(fetchNearbyJobs(nextFilters));
    }
  };

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-medium">Error loading jobs</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v5.341M16 6H8v5.341m8-5.341V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {showMyJobs ? "No job posts yet" : "No jobs found"}
        </h3>
        <p className="text-gray-600">
          {showMyJobs
            ? "Start by posting your first job"
            : "Try adjusting your search criteria to find more jobs"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onApply={handleApplyForJob}
          showActions={!showMyJobs && userInfo?.role === "worker"}
          showOwnerActions={showMyJobs}
        />
      ))}

      {/* Load More Button for Nearby Jobs */}
      {!showMyJobs && pagination && pagination.page < pagination.pages && (
        <div className="text-center pt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoading ? "Loading..." : "Load More Jobs"}
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && jobs.length > 0 && (
        <div className="text-center text-sm text-gray-600 pt-2">
          Showing {jobs.length} of {pagination.total} jobs
          {pagination.pages > 1 && (
            <span>
              {" "}
              • Page {pagination.page} of {pagination.pages}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default JobList;