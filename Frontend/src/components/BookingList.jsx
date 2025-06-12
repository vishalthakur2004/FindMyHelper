import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  fetchWorkerBookings,
  fetchCustomerBookings,
  updateBookingStatus,
} from "../features/bookingSlice";

function BookingList({ userRole = "customer" }) {
  const dispatch = useDispatch();
  const { workerBookings, customerBookings, loading, error } = useSelector(
    (state) => state.bookings,
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const bookings = userRole === "worker" ? workerBookings : customerBookings;
  const isLoading =
    userRole === "worker" ? loading.workerBookings : loading.customerBookings;
  const errorMessage =
    userRole === "worker" ? error.workerBookings : error.customerBookings;

  useEffect(() => {
    if (userRole === "worker") {
      dispatch(fetchWorkerBookings(statusFilter));
    } else {
      dispatch(fetchCustomerBookings(statusFilter));
    }
  }, [dispatch, userRole, statusFilter]);

  const handleStatusUpdate = async (bookingId, status, feedback = "") => {
    setActionLoading(bookingId);
    try {
      const result = await dispatch(
        updateBookingStatus({ bookingId, status, feedback }),
      );
      if (updateBookingStatus.fulfilled.match(result)) {
        alert(`Booking ${status} successfully!`);
      } else {
        alert(result.payload || `Failed to ${status} booking`);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert(`Failed to ${status} booking`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
      confirmed: "bg-emerald-100 text-emerald-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvailableActions = (booking) => {
    const { status } = booking;

    if (userRole === "worker") {
      switch (status) {
        case "pending":
          return [
            { label: "Accept", action: "accepted", color: "green" },
            { label: "Reject", action: "rejected", color: "red" },
          ];
        case "accepted":
          return [
            { label: "Start Work", action: "in-progress", color: "blue" },
            { label: "Cancel", action: "cancelled", color: "gray" },
          ];
        case "in-progress":
          return [{ label: "Complete", action: "completed", color: "green" }];
        default:
          return [];
      }
    } else {
      // Customer actions
      switch (status) {
        case "pending":
        case "accepted":
          return [{ label: "Cancel", action: "cancelled", color: "red" }];
        case "completed":
          return [
            { label: "Confirm & Pay", action: "confirmed", color: "green" },
          ];
        default:
          return [];
      }
    }
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="font-medium">Error loading bookings</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={statusFilter === "" ? "default" : "outline"}
          onClick={() => setStatusFilter("")}
          size="sm"
        >
          All
        </Button>
        {["pending", "accepted", "in-progress", "completed", "cancelled"].map(
          (status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => setStatusFilter(status)}
              size="sm"
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("-", " ")}
            </Button>
          ),
        )}
      </div>

      {bookings.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {userRole === "worker"
              ? "You haven't received any booking requests yet"
              : "You haven't made any bookings yet"}
          </p>
        </div>
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {userRole === "worker"
                    ? `Service for ${booking.customerId?.fullName || "Customer"}`
                    : `${booking.serviceCategory.charAt(0).toUpperCase() + booking.serviceCategory.slice(1).replace("-", " ")} Service`}
                </h3>
                <p className="text-sm text-gray-600">
                  {userRole === "worker"
                    ? `Requested by ${booking.customerId?.fullName || "Customer"}`
                    : `Booked with ${booking.workerId?.fullName || "Worker"}`}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1).replace("-", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Scheduled Date</p>
                <p className="font-medium">
                  {formatDate(booking.scheduledDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">₹{booking.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">{booking.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Service Category</p>
                <p className="font-medium">
                  {booking.serviceCategory.charAt(0).toUpperCase() +
                    booking.serviceCategory.slice(1).replace("-", " ")}
                </p>
              </div>
            </div>

            {booking.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-sm">{booking.description}</p>
              </div>
            )}

            {booking.feedback && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Feedback</p>
                <p className="text-sm">{booking.feedback}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {getAvailableActions(booking).map((action) => (
                <Button
                  key={action.action}
                  onClick={() => handleStatusUpdate(booking._id, action.action)}
                  disabled={actionLoading === booking._id}
                  variant={action.color === "green" ? "default" : "outline"}
                  size="sm"
                  className={
                    action.color === "red"
                      ? "border-red-500 text-red-600 hover:bg-red-50"
                      : action.color === "blue"
                        ? "border-blue-500 text-blue-600 hover:bg-blue-50"
                        : ""
                  }
                >
                  {actionLoading === booking._id
                    ? "Processing..."
                    : action.label}
                </Button>
              ))}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Created: {formatDate(booking.createdAt)}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

export default BookingList;