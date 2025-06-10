import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function WorkerCard({ worker, onRequest }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    serviceCategory: worker.profession?.toLowerCase() || "",
    scheduledDate: "",
    amount: "",
  });

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!requestData.scheduledDate || !requestData.amount) {
      alert("Please fill in all fields");
      return;
    }

    setIsRequesting(true);
    try {
      await onRequest(
        worker._id,
        requestData.serviceCategory,
        requestData.scheduledDate,
        parseFloat(requestData.amount),
      );
      setShowRequestForm(false);
      setRequestData({
        serviceCategory: worker.profession?.toLowerCase() || "",
        scheduledDate: "",
        amount: "",
      });
    } finally {
      setIsRequesting(false);
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
          <p className="text-blue-600 font-medium">{worker.profession}</p>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {renderStars(worker.avgRating || 0)}
            </div>
            <span className="text-sm text-gray-600">
              ({worker.avgRating?.toFixed(1) || "0.0"})
            </span>
            <span className="text-sm text-gray-500">
              • {worker.reviews?.length || 0} reviews
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

        {worker.availabilityTimes && worker.availabilityTimes.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">🕒</span>
            <span>Available {worker.availabilityTimes.length} days/week</span>
          </div>
        )}

        {worker.bookingsAday && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">📊</span>
            <span>Up to {worker.bookingsAday} bookings/day</span>
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

      <div className="space-y-3">
        {!showRequestForm ? (
          <Button
            onClick={() => setShowRequestForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Request Worker
          </Button>
        ) : (
          <form onSubmit={handleRequest} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Needed
              </label>
              <select
                value={requestData.serviceCategory}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    serviceCategory: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">{worker.profession}</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="carpenter">Carpenter</option>
                <option value="painter">Painter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="datetime-local"
                value={requestData.scheduledDate}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    scheduledDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (₹)
              </label>
              <input
                type="number"
                value={requestData.amount}
                onChange={(e) =>
                  setRequestData({ ...requestData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your budget"
                min="0"
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowRequestForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isRequesting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isRequesting ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </form>
        )}

        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
}

export default WorkerCard;