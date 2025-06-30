import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  Send,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { JOB_CATEGORIES, PRICE_RANGES } from "../constants";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    budget: "",
    sortBy: "createdAt",
  });

  // Mock data for demonstration
  useEffect(() => {
    setJobs([
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
      },
    ]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleApply = (jobId) => {
    alert(
      `Applied to job ${jobId}! This would normally open an application modal.`,
    );
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
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
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
