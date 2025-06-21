import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { updateBookingStatus } from "../features/bookingSlice";

function BookingCard({ booking, userRole, onViewDetails }) {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      confirmed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleStatusUpdate = async (newStatus, feedback = "") => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateBookingStatus({
          bookingId: booking._id,
          status: newStatus,
          feedback,
        }),
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmWithReview = async () => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateBookingStatus({
          bookingId: booking._id,
          status: "confirmed",
          feedback: JSON.stringify({
            rating: reviewData.rating,
            review: reviewData.review,
          }),
        }),
      );
      setShowReviewForm(false);
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderWorkerActions = () => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="worker-actions flex gap-2">
            <Button
              onClick={() => handleStatusUpdate("accepted")}
              disabled={isUpdating}
              className="accept-button bg-green-600 hover:bg-green-700 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={() => {
                const reason = prompt("Reason for rejection (optional):");
                handleStatusUpdate("rejected", reason || "");
              }}
              disabled={isUpdating}
              variant="outline"
              className="reject-button text-red-600 hover:text-red-700"
            >
              Reject
            </Button>
          </div>
        );

      case "accepted":
        return (
          <Button
            onClick={() => handleStatusUpdate("in-progress")}
            disabled={isUpdating}
            className="start-work-button bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Work
          </Button>
        );

      case "in-progress":
        return (
          <Button
            onClick={() => handleStatusUpdate("completed")}
            disabled={isUpdating}
            className="complete-work-button bg-green-600 hover:bg-green-700 text-white"
          >
            Mark as Completed
          </Button>
        );

      default:
        return null;
    }
  };

  const renderCustomerActions = () => {
    switch (booking.status) {
      case "pending":
      case "accepted":
      case "in-progress":
        return (
          <Button
            onClick={() => {
              const reason = prompt("Reason for cancellation:");
              if (reason) handleStatusUpdate("cancelled", reason);
            }}
            disabled={isUpdating}
            variant="outline"
            className="cancel-button text-red-600 hover:text-red-700"
          >
            Cancel Booking
          </Button>
        );

      case "completed":
        return (
          <div className="customer-actions flex gap-2">
            {!showReviewForm ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="confirm-button bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm & Review
              </Button>
            ) : (
              <div className="review-form w-full">
                <div className="review-inputs space-y-3">
                  <div className="rating-input">
                    <label className="rating-label block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <select
                      value={reviewData.rating}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          rating: parseInt(e.target.value),
                        })
                      }
                      className="rating-select w-full p-2 border border-gray-300 rounded-md"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Star{rating !== 1 ? "s" : ""}{" "}
                          {"★".repeat(rating)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="review-input">
                    <label className="review-label block text-sm font-medium text-gray-700 mb-1">
                      Review (Optional)
                    </label>
                    <textarea
                      value={reviewData.review}
                      onChange={(e) =>
                        setReviewData({ ...reviewData, review: e.target.value })
                      }
                      placeholder="How was your experience?"
                      className="review-textarea w-full p-2 border border-gray-300 rounded-md resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="review-actions flex gap-2 mt-3">
                  <Button
                    onClick={handleConfirmWithReview}
                    disabled={isUpdating}
                    className="submit-review bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isUpdating ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    onClick={() => setShowReviewForm(false)}
                    variant="outline"
                    className="cancel-review"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getOtherPartyInfo = () => {
    if (userRole === "customer") {
      return {
        name: booking.workerId?.fullName || "Worker",
        photo: booking.workerId?.photo,
        role: "Worker",
      };
    } else {
      return {
        name: booking.customerId?.fullName || "Customer",
        photo: booking.customerId?.photo,
        role: "Customer",
      };
    }
  };

  const otherParty = getOtherPartyInfo();

  return (
    <Card className="booking-card border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="card-header p-4 border-b border-gray-100">
        <div className="header-content flex justify-between items-start">
          <div className="booking-info">
            <h3 className="service-title text-lg font-semibold text-gray-900">
              {booking.serviceCategory
                ?.replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </h3>
            <div className="booking-meta flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="booking-amount text-green-600 font-semibold">
                ₹{booking.amount}
              </span>
              <span className="booking-date">
                {formatDate(booking.scheduledDate)}
              </span>
            </div>
          </div>

          <span
            className={`status-badge px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
          >
            {booking.status.replace("-", " ")}
          </span>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="other-party-info flex items-center gap-3 mb-4">
          <div className="party-avatar w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {otherParty.photo ? (
              <img
                src={otherParty.photo}
                alt={otherParty.name}
                className="avatar-image w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="avatar-initial text-gray-600 font-medium">
                {otherParty.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="party-details">
            <p className="party-name font-medium text-gray-900">
              {otherParty.name}
            </p>
            <p className="party-role text-sm text-gray-500">
              {otherParty.role}
            </p>
          </div>
        </div>

        {booking.description && (
          <div className="booking-description mb-4">
            <p className="description-text text-gray-700 text-sm line-clamp-2">
              {booking.description}
            </p>
          </div>
        )}

        <div className="booking-details grid grid-cols-2 gap-4 mb-4 text-sm">
          {booking.location && (
            <div className="location-detail">
              <span className="detail-label text-gray-500">Location:</span>
              <span className="detail-value ml-1 text-gray-700">
                {booking.location.address}
              </span>
            </div>
          )}
          {booking.duration && (
            <div className="duration-detail">
              <span className="detail-label text-gray-500">Duration:</span>
              <span className="detail-value ml-1 text-gray-700">
                {booking.duration}
              </span>
            </div>
          )}
        </div>

        {booking.notes && (
          <div className="booking-notes mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="notes-text text-sm text-gray-700">{booking.notes}</p>
          </div>
        )}

        {(booking.status === "rejected" || booking.status === "cancelled") &&
          booking.feedback && (
            <div className="status-feedback mb-4 p-3 bg-red-50 rounded-lg">
              <p className="feedback-text text-sm text-red-700">
                <strong>Reason:</strong> {booking.feedback}
              </p>
            </div>
          )}

        {booking.review && (
          <div className="booking-review mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="review-header flex items-center gap-2 mb-2">
              <span className="review-rating text-yellow-500">
                {"★".repeat(booking.review.rating)}
                {"☆".repeat(5 - booking.review.rating)}
              </span>
              <span className="rating-text text-sm text-gray-600">
                ({booking.review.rating}/5)
              </span>
            </div>
            {booking.review.comment && (
              <p className="review-comment text-sm text-gray-700">
                {booking.review.comment}
              </p>
            )}
          </div>
        )}

        <div className="card-actions">
          {userRole === "worker"
            ? renderWorkerActions()
            : renderCustomerActions()}

          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(booking)}
              variant="outline"
              className="view-details-button mt-2"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default BookingCard;
