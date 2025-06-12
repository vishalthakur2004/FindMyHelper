import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function WorkerCard({ worker, onBook, showActions = false }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleBookWorker = () => {
    if (onBook) {
      onBook(worker);
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>,
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>,
      );
    }

    return stars;
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
          {worker.photo ? (
            <img
              src={worker.photo}
              alt={worker.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
              {worker.fullName?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {worker.fullName}
          </h3>
          <p className="text-blue-600 font-medium">
            {worker.serviceCategories?.join(", ") || worker.profession}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {renderStars(worker.rating || worker.avgRating || 0)}
            </div>
            <span className="text-sm text-gray-600">
              ({(worker.rating || worker.avgRating)?.toFixed(1) || "0.0"})
            </span>
            <span className="text-sm text-gray-500">
              • {worker.totalReviews || worker.reviews?.length || 0} reviews
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">📍</span>
          <span>
            {worker.address?.city}, {worker.address?.state}
          </span>
          {worker.distance && (
            <span className="ml-2 text-blue-600">
              • {formatDistance(worker.distance)}
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">🕒</span>
          <span
            className={worker.isAvailable ? "text-green-600" : "text-red-600"}
          >
            {worker.isAvailable ? "Available now" : "Currently unavailable"}
          </span>
        </div>

        {worker.experienceYears && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">💼</span>
            <span>{worker.experienceYears} years experience</span>
          </div>
        )}

         {worker.completedJobs && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">✅</span>
            <span>{worker.completedJobs} jobs completed</span>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {worker.reviews && worker.reviews.length > 0 && (
        <div className="border-t pt-3 mb-4">
          <div className="text-sm">
            <div className="font-medium text-gray-900 mb-1">Recent Review:</div>
            <div className="text-gray-600 italic">
              "{worker.reviews[0].comment}"
            </div>
            <div className="text-gray-500 text-xs mt-1">
              - {worker.reviews[0].customer?.fullName}
            </div>
          </div>
        </div>
      )}

      {showActions && (
        <div className="space-y-3">
          <Button
            onClick={handleBookWorker}
            disabled={!worker.isAvailable}
            className={`w-full ${
              worker.isAvailable
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {worker.isAvailable ? "Book Worker" : "Currently Unavailable"}
          </Button>
        <Button
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            View Profile
          </Button>
        </div>
      )}
    </Card>
  );
}

export default WorkerCard;