import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Star, Filter, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { userService } from "../services/userService";
import { JOB_CATEGORIES, PRICE_RANGES } from "../constants";

const FindWorkersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: "",
    rating: "",
    priceRange: "",
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await userService.searchUsers(filters.search, {
        category: filters.category,
        location: filters.location,
        rating: filters.rating,
        priceRange: filters.priceRange,
      });
      setWorkers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkers();

    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      rating: "",
      priceRange: "",
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Find Workers</h1>
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for services or professionals..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
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

              <div>
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={filters.rating}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, rating: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <div>
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
                  <option value="">Any Price</option>
                  {PRICE_RANGES.map((range, index) => (
                    <option
                      key={index}
                      value={`${range.min}-${range.max || ""}`}
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(filters.search ||
              filters.category ||
              filters.location ||
              filters.rating ||
              filters.priceRange) && (
              <div className="flex justify-between items-center pt-2">
                <p className="text-sm text-gray-600">
                  {workers.length} workers found
                </p>
                <Button
                  type="button"
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Searching for workers...</p>
          </div>
        ) : workers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
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
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {worker.rating?.toFixed(1) || "5.0"} (
                        {worker.reviewCount || "0"} reviews)
                      </span>
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
              Try adjusting your search criteria or browse all categories
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWorkersPage;
