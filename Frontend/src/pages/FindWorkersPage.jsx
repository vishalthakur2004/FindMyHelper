import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Users,
  Navigation,
  Target,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import NearbySearch from "../components/NearbySearch";
import LocationSelector from "../components/LocationSelector";
import { userService } from "../services/userService";
import { locationService } from "../services/locationService";
import { JOB_CATEGORIES, PRICE_RANGES } from "../constants";
import { useToast } from "../hooks/useToast";

const FindWorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNearbySearch, setShowNearbySearch] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const { showError } = useToast();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: "",
    rating: "",
    priceRange: "",
    sortBy: "distance", // Default to distance when location is available
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      let response;

      if (searchLocation && filters.sortBy === "distance") {
        // Use location-based search
        response = await userService.getNearbyWorkers(
          searchLocation.latitude,
          searchLocation.longitude,
          25, // 25km radius
          {
            search: filters.search,
            category: filters.category,
            rating: filters.rating,
            priceRange: filters.priceRange,
          },
        );
        setWorkers(response.data.workers || []);
      } else {
        // Use regular search
        response = await userService.searchUsers(filters.search, {
          category: filters.category,
          location: filters.location,
          rating: filters.rating,
          priceRange: filters.priceRange,
        });
        setWorkers(response.data.users || []);
      }
    } catch (error) {
      showError("Failed to fetch workers");
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [searchLocation, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers();

    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    setSearchParams(params);
  };

  const handleNearbyResults = (data) => {
    setWorkers(data.workers || []);
    setShowNearbySearch(false);
  };

  const handleLocationSelect = (location) => {
    setSearchLocation(location);
    if (location) {
      setFilters((prev) => ({ ...prev, sortBy: "distance" }));
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      rating: "",
      priceRange: "",
      sortBy: searchLocation ? "distance" : "createdAt",
    });
    setSearchParams({});
  };

  const sortWorkers = (workersToSort) => {
    const sorted = [...workersToSort];

    switch (filters.sortBy) {
      case "distance":
        return sorted.sort(
          (a, b) => (a.distance || Infinity) - (b.distance || Infinity),
        );
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "price_asc":
        return sorted.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
      case "price_desc":
        return sorted.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
      default:
        return sorted;
    }
  };

  const sortedWorkers = sortWorkers(workers);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Find Workers</h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowNearbySearch(!showNearbySearch)}
                variant={showNearbySearch ? "default" : "outline"}
                size="sm"
              >
                <Target className="h-4 w-4 mr-2" />
                Nearby Search
              </Button>
              <Button onClick={() => window.history.back()} variant="outline">
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Nearby Search Component */}
            {showNearbySearch && (
              <NearbySearch
                type="workers"
                onResultsUpdate={handleNearbyResults}
                filters={filters}
              />
            )}

            {/* Regular Search Filters */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Filters
              </h3>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Skills, services, names..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <LocationSelector
                    onLocationSelect={handleLocationSelect}
                    currentLocation={searchLocation}
                    placeholder="Enter location to search nearby"
                    showCurrentLocationButton={true}
                    className="mb-2"
                  />

                  {searchLocation && (
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {searchLocation.isCurrent
                          ? "Current location"
                          : searchLocation.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {JOB_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Rate</option>
                    {PRICE_RANGES.map((range, index) => (
                      <option
                        key={index}
                        value={`${range.min}-${range.max || ""}`}
                      >
                        {range.label}/hour
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {searchLocation && (
                      <option value="distance">Distance</option>
                    )}
                    <option value="rating">Highest Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="createdAt">Most Recent</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Searching..." : "Search"}
                  </Button>
                  <Button
                    type="button"
                    onClick={clearFilters}
                    variant="outline"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchLocation ? "Nearby Workers" : "Available Workers"}
                </h2>
                <p className="text-gray-600">
                  {sortedWorkers.length} worker
                  {sortedWorkers.length !== 1 ? "s" : ""} found
                  {searchLocation &&
                    ` near ${searchLocation.city || "your location"}`}
                </p>
              </div>
            </div>

            {/* Workers Grid */}
            {loading ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Searching for workers...</p>
              </div>
            ) : sortedWorkers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {sortedWorkers.map((worker) => (
                  <Card
                    key={worker._id}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {worker.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {worker.category || "General Services"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {worker.rating?.toFixed(1) || "5.0"} (
                              {worker.reviewCount || "0"} reviews)
                            </span>
                          </div>
                          {worker.distance && (
                            <span className="text-sm text-gray-500">
                              • {worker.distanceFormatted} away
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {worker.skills &&
                        worker.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mr-2"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{worker.address || "Location not specified"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Starting from</p>
                        <p className="font-semibold text-gray-900">
                          ${worker.hourlyRate || "25"}/hour
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No workers found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchLocation
                    ? "Try expanding your search radius or adjusting your filters"
                    : "Try adjusting your search criteria or enable location to find nearby workers"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                  {!searchLocation && (
                    <Button onClick={() => setShowNearbySearch(true)}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Search Nearby
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWorkersPage;
