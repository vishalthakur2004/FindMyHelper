import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchNearbyJobs, setFilters } from "../features/jobSlice";

function JobSearch({ onSearch }) {
  const dispatch = useDispatch();
  const { filters, loading, error } = useSelector((state) => state.jobs);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    if (name.startsWith("budget.")) {
      const budgetField = name.split(".")[1];
      setLocalFilters((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          [budgetField]: value,
        },
      }));
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearch = async () => {
    dispatch(setFilters(localFilters));
    await dispatch(fetchNearbyJobs(localFilters));

    if (onSearch) {
      onSearch(localFilters);
    }
  };

  const handleReset = async () => {
    const resetFilters = {
      budget: { min: "", max: "" },
      location: "",
      urgency: "",
      sortBy: "newest",
    };
    setLocalFilters(resetFilters);
    dispatch(setFilters(resetFilters));
    await dispatch(fetchNearbyJobs(resetFilters));

    if (onSearch) {
      onSearch(resetFilters);
    }
  };

  const budgetRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
    { label: "₹2,000 - ₹5,000", min: 2000, max: 5000 },
    { label: "Above ₹5,000", min: 5000, max: 999999 },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Jobs</h3>
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
          placeholder="Search by location (city, pincode)..."
          value={localFilters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleSearch}
          disabled={loading.nearbyJobs}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading.nearbyJobs ? "Searching..." : "Search"}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Budget Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
              {budgetRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleFilterChange("budget.min", range.min);
                    handleFilterChange("budget.max", range.max);
                  }}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                    localFilters.budget.min == range.min &&
                    localFilters.budget.max == range.max
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:border-blue-500"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min budget"
                  value={localFilters.budget.min}
                  onChange={(e) =>
                    handleFilterChange("budget.min", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max budget"
                  value={localFilters.budget.max}
                  onChange={(e) =>
                    handleFilterChange("budget.max", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Urgency
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("urgency", "")}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  localFilters.urgency === ""
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => handleFilterChange("urgency", "urgent")}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  localFilters.urgency === "urgent"
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-300 hover:border-red-500"
                }`}
              >
                Urgent (24h)
              </button>
              <button
                onClick={() => handleFilterChange("urgency", "this-week")}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  localFilters.urgency === "this-week"
                    ? "bg-yellow-600 text-white border-yellow-600"
                    : "border-gray-300 hover:border-yellow-500"
                }`}
              >
                This Week
              </button>
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
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
              <option value="distance">Nearest First</option>
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
    </Card>
  );
}

export default JobSearch;