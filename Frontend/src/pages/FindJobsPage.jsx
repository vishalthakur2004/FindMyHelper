import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  Send,
  Target,
  Navigation,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import NearbySearch from "../components/NearbySearch";
import LocationSelector from "../components/LocationSelector";
import { locationService } from "../services/locationService";
import { JOB_CATEGORIES, PRICE_RANGES } from "../constants";
import { useToast } from "../hooks/useToast";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNearbySearch, setShowNearbySearch] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const { showError } = useToast();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    budget: "",
    sortBy: "distance", // Default to distance when location is available
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let jobData;

      if (searchLocation && filters.sortBy === "distance") {
        // Use location-based search
        jobData = await locationService.getNearbyJobs(
          searchLocation.latitude,
          searchLocation.longitude,
          25, // 25km radius
          {
            search: filters.search,
            category: filters.category,
            budget: filters.budget,
          },
        );
        setJobs(jobData.jobs || []);
      } else {
        // Use mock data for demonstration - in real app, this would be an API call
        const mockJobs = [
          {
            id: 1,
            title: "House Deep Cleaning Service",
            description:
              "Need a thorough deep cleaning of my 3-bedroom house. Includes kitchen, bathrooms, and all living areas.",
            category: "Cleaning",
            budget: 150,
            location: "Downtown San Francisco",
            postedDate: "2024-01-15",
            deadline: "2024-01-20",
            customer: { name: "Sarah Johnson", rating: 4.8 },
            applicants: 5,
            status: "open",
            coordinates: { lat: 37.7749, lng: -122.4194 },
          },
          {
            id: 2,
            title: "Kitchen Faucet Repair",
            description:
              "My kitchen faucet is leaking and needs immediate repair. Must be available this weekend.",
            category: "Plumbing",
            budget: 120,
            location: "Mission District",
            postedDate: "2024-01-14",
            deadline: "2024-01-18",
            customer: { name: "Mike Chen", rating: 4.9 },
            applicants: 8,
            status: "urgent",
            coordinates: { lat: 37.7598, lng: -122.4148 },
          },
          {
            id: 3,
            title: "Garden Landscaping Project",
            description:
              "Complete backyard makeover including lawn, plants, and decorative elements.",
            category: "Gardening",
            budget: 500,
            location: "Sunset District",
            postedDate: "2024-01-13",
            deadline: "2024-01-25",
            customer: { name: "Emily Davis", rating: 4.7 },
            applicants: 12,
            status: "open",
            coordinates: { lat: 37.7559, lng: -122.4689 },
          },
        ];

        // Add distance calculation if search location is available
        if (searchLocation) {
          const jobsWithDistance = mockJobs.map((job) => {
            if (job.coordinates) {
              const distance = locationService.calculateDistance(
                searchLocation.latitude,
                searchLocation.longitude,
                job.coordinates.lat,
                job.coordinates.lng,
              );
              return {
                ...job,
                distance,
                distanceFormatted: locationService.formatDistance(distance),
              };
            }
            return job;
          });
          setJobs(jobsWithDistance);
        } else {
          setJobs(mockJobs);
        }
      }
    } catch (error) {
      showError("Failed to fetch jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchLocation, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = (jobId) => {
    alert(
      `Applied to job ${jobId}! This would normally open an application modal.`,
    );
  };

  const handleNearbyResults = (data) => {
    setJobs(data.jobs || []);
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
      budget: "",
      sortBy: searchLocation ? "distance" : "createdAt",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (!filters.search ||
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.category || job.category === filters.category) &&
      (!filters.location ||
        job.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Find Jobs</h1>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for jobs..."
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
                  value={filters.budget}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, budget: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Budget</option>
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

              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt">Most Recent</option>
                  <option value="budget_desc">Highest Budget</option>
                  <option value="budget_asc">Lowest Budget</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
            </div>
          </form>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Deadline {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ${job.budget}
                  </div>
                  <p className="text-sm text-gray-600">
                    {job.applicants} applicants
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {job.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    Customer:{" "}
                    <span className="font-medium">{job.customer.name}</span>
                    <span className="text-yellow-500 ml-1">
                      ★ {job.customer.rating}
                    </span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" onClick={() => handleApply(job.id)}>
                    <Send className="h-4 w-4 mr-1" />
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or check back later for new
                opportunities
              </p>
              <Button
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "",
                    location: "",
                    budget: "",
                    sortBy: "createdAt",
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindJobsPage;
