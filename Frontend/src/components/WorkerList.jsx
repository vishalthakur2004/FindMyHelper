import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorkerCard from "./WorkerCard";
import BookingForm from "./BookingForm";
import { Button } from "./ui/button";
import { fetchNearbyWorkers } from "../features/bookingSlice";

function WorkerList({ filters }) {
  const dispatch = useDispatch();
  const { nearbyWorkers, loading, error, pagination } = useSelector(
    (state) => state.bookings,
  );
  const { userInfo } = useSelector((state) => state.user);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    dispatch(fetchNearbyWorkers(filters));
  }, [dispatch, filters]);

  const handleBookWorker = (worker) => {
    if (!userInfo) {
      alert("Please login to book a worker");
      return;
    }

    if (userInfo.role !== "customer") {
      alert("Only customers can book workers");
      return;
    }

    setSelectedWorker(worker);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (booking) => {
    setShowBookingForm(false);
    setSelectedWorker(null);
    alert("Booking request sent successfully!");
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
    setSelectedWorker(null);
  };

  const handleLoadMore = () => {
    if (pagination && pagination.hasNext) {
      const nextFilters = {
        ...filters,
        page: pagination.currentPage + 1,
      };
      dispatch(fetchNearbyWorkers(nextFilters));
    }
  };

  if (loading.nearbyWorkers && nearbyWorkers.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Finding workers...</p>
        </div>
      </div>
    );
  }

  if (error.nearbyWorkers) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-medium">Error loading workers</p>
        <p className="text-sm">{error.nearbyWorkers}</p>
      </div>
    );
  }

  if (nearbyWorkers.length === 0) {
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No workers found
        </h3>
        <p className="text-gray-600">
          Try expanding your search radius or changing the service category
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Booking Form Modal */}
      {showBookingForm && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <BookingForm
              worker={selectedWorker}
              onSubmit={handleBookingSuccess}
              onCancel={handleBookingCancel}
            />
          </div>
        </div>
      )}

      {/* Worker Cards */}
      {nearbyWorkers.map((worker) => (
        <WorkerCard
          key={worker._id}
          worker={worker}
          onBook={handleBookWorker}
          showActions={userInfo?.role === "customer"}
        />
      ))}

      {/* Load More Button */}
      {pagination && pagination.hasNext && (
        <div className="text-center pt-4">
          <Button
            onClick={handleLoadMore}
            disabled={loading.nearbyWorkers}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {loading.nearbyWorkers ? "Loading..." : "Load More Workers"}
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && nearbyWorkers.length > 0 && (
        <div className="text-center text-sm text-gray-600 pt-2">
          Showing {nearbyWorkers.length} of {pagination.total} workers
          {pagination.totalPages > 1 && (
            <span>
              {" "}
              • Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkerList;