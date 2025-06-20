import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchNearbyWorkers, setFilters } from "../features/bookingSlice";

function WorkerSearch({ onSearch }) {
  const dispatch = useDispatch();
  const { filters, loading, error } = useSelector((state) => state.bookings);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    dispatch(setFilters(localFilters));
    const result = await dispatch(fetchNearbyWorkers(localFilters));

    if (onSearch) {
      onSearch(localFilters, result);
    }
  };

  const handleReset = async () => {
    const resetFilters = {
      location: "",
      serviceCategory: "",
      radius: 10,
      rating: 0,
      sortBy: "distance",
    };
    setLocalFilters(resetFilters);
    dispatch(setFilters(resetFilters));
    const result = await dispatch(fetchNearbyWorkers(resetFilters));

    if (onSearch) {
      onSearch(resetFilters, result);
    }
  };

  const serviceCategories = [
    { value: "plumber", label: "Plumber" },
    { value: "electrician", label: "Electrician" },
    { value: "carpenter", label: "Carpenter" },
    { value: "painter", label: "Painter" },
    { value: "mason", label: "Mason" },
    { value: "ac-technician", label: "AC Technician" },
    { value: "appliance-repair", label: "Appliance Repair" },
    { value: "pest-control", label: "Pest Control" },
    { value: "gardener", label: "Gardener" },
    { value: "cleaner", label: "Cleaner" },
  ];

  const radiusOptions = [
    { value: 1000, label: "1 km" },
    { value: 5000, label: "5 km" },
    { value: 10000, label: "10 km" },
    { value: 25000, label: "25 km" },
    { value: 50000, label: "50 km" },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Find Workers</h3>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Quick Search Bar */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by location (city, area, pincode)..."
          value={localFilters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleSearch}
          disabled={loading.nearbyWorkers}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading.nearbyWorkers ? "Searching..." : "Search"}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Service Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category
            </label>
            <select
              value={localFilters.serviceCategory}
              onChange={(e) =>
                handleFilterChange("serviceCategory", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Services</option>
              {serviceCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {radiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("radius", option.value)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                    localFilters.radius === option.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange("rating", rating)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                    localFilters.rating === rating
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {rating === 0 ? "Any" : `${rating}+ ⭐`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      )}

      {error.nearbyWorkers && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error.nearbyWorkers}</p>
        </div>
      )}
    </Card>
  );
}

export default WorkerSearch;