import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { fetchNearbyWorkers, createBooking } from "../features/bookingSlice";

function SearchWorkers() {
  const dispatch = useDispatch();
  const { nearbyWorkers, loading, error } = useSelector(
    (state) => state.bookings,
  );
  const [filters, setFilters] = useState({
    serviceCategory: "",
    location: "",
    radius: 10,
    rating: 0,
    sortBy: "distance",
  });
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    serviceCategory: "",
    description: "",
    scheduledDate: "",
    amount: "",
    duration: "",
    notes: "",
  });

  const serviceCategories = [
    { value: "", label: "All Services" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "cleaning", label: "Cleaning" },
    { value: "painting", label: "Painting" },
    { value: "carpentry", label: "Carpentry" },
    { value: "gardening", label: "Gardening" },
    { value: "moving", label: "Moving & Packing" },
    { value: "appliance-repair", label: "Appliance Repair" },
    { value: "handyman", label: "General Handyman" },
  ];

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      serviceCategory: filters.serviceCategory || undefined,
    };
    dispatch(fetchNearbyWorkers(searchFilters));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleBookWorker = (worker) => {
    setSelectedWorker(worker);
    setBookingData((prev) => ({
      ...prev,
      serviceCategory: filters.serviceCategory || worker.profession || "",
      amount: worker.hourlyRate || "",
    }));
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (
      !bookingData.serviceCategory ||
      !bookingData.description ||
      !bookingData.scheduledDate
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const result = await dispatch(
        createBooking({
          workerId: selectedWorker._id,
          ...bookingData,
          scheduledDate: new Date(bookingData.scheduledDate).toISOString(),
        }),
      );

      if (result.type === "bookings/createBooking/fulfilled") {
        setShowBookingForm(false);
        setSelectedWorker(null);
        setBookingData({
          serviceCategory: "",
          description: "",
          scheduledDate: "",
          amount: "",
          duration: "",
          notes: "",
        });
        alert("Booking request sent successfully!");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const formatRating = (rating) => {
    const stars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      "★".repeat(stars) +
      (halfStar ? "☆" : "") +
      "☆".repeat(5 - stars - (halfStar ? 1 : 0))
    );
  };

  const getMinimumDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <div className="search-workers-container">
      {/* Search Filters */}
      <Card className="filters-card p-6 mb-6">
        <h2 className="filters-title text-xl font-semibold mb-4">
          Find Workers Near You
        </h2>

        <div className="filters-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="service-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Service Category
            </label>
            <select
              value={filters.serviceCategory}
              onChange={(e) =>
                handleFilterChange("serviceCategory", e.target.value)
              }
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              {serviceCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="location-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              placeholder="Enter area or pincode"
              className="filter-input w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="radius-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Radius (km)
            </label>
            <select
              value={filters.radius}
              onChange={(e) =>
                handleFilterChange("radius", parseInt(e.target.value))
              }
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          <div className="rating-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Min Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) =>
                handleFilterChange("rating", parseInt(e.target.value))
              }
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          <div className="sort-filter">
            <label className="filter-label block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="filter-select w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
              <option value="price">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={loading.nearbyWorkers}
          className="search-button bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading.nearbyWorkers ? "Searching..." : "Search Workers"}
        </Button>
      </Card>

      {/* Search Results */}
      <div className="search-results">
        {loading.nearbyWorkers ? (
          <div className="loading-state text-center py-8">
            <div className="loading-spinner animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="loading-text text-gray-600">
              Finding workers near you...
            </p>
          </div>
        ) : error.nearbyWorkers ? (
          <Card className="error-state p-6 text-center">
            <div className="error-icon text-4xl mb-2">⚠️</div>
            <h3 className="error-title text-lg font-semibold text-red-600 mb-2">
              Search Failed
            </h3>
            <p className="error-message text-gray-600 mb-4">
              {error.nearbyWorkers}
            </p>
            <Button onClick={handleSearch} className="retry-button">
              Try Again
            </Button>
          </Card>
        ) : nearbyWorkers.length > 0 ? (
          <div className="workers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyWorkers.map((worker) => (
              <Card
                key={worker._id}
                className="worker-card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="worker-header p-4 border-b border-gray-100">
                  <div className="worker-profile flex items-center gap-3 mb-3">
                    <div className="worker-avatar w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {worker.photo ? (
                        <img
                          src={worker.photo}
                          alt={worker.fullName}
                          className="avatar-image w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="avatar-initial text-gray-600 font-medium">
                          {worker.fullName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="worker-info">
                      <h3 className="worker-name text-lg font-semibold text-gray-900">
                        {worker.fullName}
                      </h3>
                      <p className="worker-profession text-sm text-gray-600 capitalize">
                        {worker.profession?.replace("-", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="worker-stats flex items-center gap-4">
                    <div className="rating-display flex items-center gap-1">
                      <span className="rating-stars text-yellow-500">
                        {formatRating(worker.averageRating || 0)}
                      </span>
                      <span className="rating-count text-sm text-gray-600">
                        ({worker.totalReviews || 0})
                      </span>
                    </div>
                    <div className="hourly-rate text-green-600 font-semibold">
                      ₹{worker.hourlyRate || "N/A"}/hr
                    </div>
                  </div>
                </div>

                <div className="worker-body p-4">
                  {worker.bio && (
                    <p className="worker-bio text-gray-700 text-sm mb-3 line-clamp-2">
                      {worker.bio}
                    </p>
                  )}

                  <div className="worker-details space-y-2 mb-4 text-sm">
                    {worker.experience && (
                      <div className="experience-info">
                        <span className="detail-label text-gray-500">
                          Experience:
                        </span>
                        <span className="detail-value ml-1 text-gray-700">
                          {worker.experience} years
                        </span>
                      </div>
                    )}

                    {worker.location && (
                      <div className="location-info">
                        <span className="detail-label text-gray-500">
                          Location:
                        </span>
                        <span className="detail-value ml-1 text-gray-700">
                          {worker.location.address}
                        </span>
                      </div>
                    )}

                    {worker.skills && worker.skills.length > 0 && (
                      <div className="skills-info">
                        <span className="detail-label text-gray-500">
                          Skills:
                        </span>
                        <div className="skills-tags flex flex-wrap gap-1 mt-1">
                          {worker.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="skill-tag bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {worker.skills.length > 3 && (
                            <span className="more-skills text-xs text-gray-500">
                              +{worker.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="worker-actions flex gap-2">
                    <Button
                      onClick={() => handleBookWorker(worker)}
                      className="book-worker bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(`/workers/${worker._id}`, "_blank")
                      }
                      className="view-profile"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="empty-state p-8 text-center">
            <div className="empty-icon text-6xl mb-4">🔍</div>
            <h3 className="empty-title text-xl font-semibold text-gray-900 mb-2">
              No Workers Found
            </h3>
            <p className="empty-message text-gray-600 mb-4">
              No workers found matching your search criteria. Try adjusting your
              filters.
            </p>
            <Button onClick={handleSearch} className="search-again-button">
              Search Again
            </Button>
          </Card>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedWorker && (
        <div className="booking-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="booking-form-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="form-header p-6 border-b border-gray-200">
              <h2 className="form-title text-xl font-semibold text-gray-900">
                Book {selectedWorker.fullName}
              </h2>
              <p className="form-subtitle text-gray-600">
                Fill in the details for your service request
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form p-6">
              <div className="form-fields space-y-4">
                <div className="service-category-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Service Category *
                  </label>
                  <select
                    value={bookingData.serviceCategory}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        serviceCategory: e.target.value,
                      })
                    }
                    className="field-select w-full p-3 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a service</option>
                    {serviceCategories.slice(1).map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="description-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Service Description *
                  </label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe what you need done..."
                    className="field-textarea w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="scheduled-date-field">
                    <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={bookingData.scheduledDate}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          scheduledDate: e.target.value,
                        })
                      }
                      min={getMinimumDate()}
                      className="field-input w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="amount-field">
                    <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                      Budget (₹) *
                    </label>
                    <input
                      type="number"
                      value={bookingData.amount}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          amount: e.target.value,
                        })
                      }
                      placeholder={`Suggested: ₹${selectedWorker.hourlyRate}/hr`}
                      className="field-input w-full p-3 border border-gray-300 rounded-md"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="duration-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={bookingData.duration}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        duration: e.target.value,
                      })
                    }
                    placeholder="e.g., 2 hours, Half day, Full day"
                    className="field-input w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="notes-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, notes: e.target.value })
                    }
                    placeholder="Any special instructions or requirements..."
                    className="field-textarea w-full p-3 border border-gray-300 rounded-md resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-actions flex gap-3 mt-6">
                <Button
                  type="submit"
                  disabled={loading.creating}
                  className="submit-booking bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {loading.creating
                    ? "Sending Request..."
                    : "Send Booking Request"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  variant="outline"
                  className="cancel-booking"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SearchWorkers;
