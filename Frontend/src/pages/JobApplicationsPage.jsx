import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const { userInfo } = useSelector((state) => state.user);

  // Mock data for demonstration
  useEffect(() => {
    setApplications([
      {
        id: 1,
        job: {
          title: "House Cleaning Service",
          location: "Downtown",
          budget: 120,
        },
        status: "pending",
        appliedAt: "2024-01-15",
        customer: { name: "Sarah Johnson" },
      },
      {
        id: 2,
        job: { title: "Plumbing Repair", location: "Suburb", budget: 200 },
        status: "accepted",
        appliedAt: "2024-01-14",
        customer: { name: "Mike Chen" },
      },
      {
        id: 3,
        job: { title: "Garden Maintenance", location: "Uptown", budget: 150 },
        status: "rejected",
        appliedAt: "2024-01-13",
        customer: { name: "Emily Davis" },
      },
    ]);
  }, []);

  const filteredApplications = applications.filter(
    (app) => filter === "all" || app.status === filter,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">
              My Applications
            </h1>
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Job Applications
          </h1>

          <div className="flex gap-2">
            {["all", "pending", "accepted", "rejected"].map((status) => (
              <Button
                key={status}
                onClick={() => setFilter(status)}
                variant={filter === status ? "default" : "outline"}
                size="sm"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span className="ml-1">
                    ({applications.filter((a) => a.status === status).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {application.job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {application.job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />$
                      {application.job.budget}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}
                >
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Customer:{" "}
                  <span className="font-medium">
                    {application.customer.name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Job
                  </Button>

                  {application.status === "accepted" && (
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Contact Customer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {filter !== "all" ? filter : ""} applications found
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === "all"
                  ? "You haven't applied for any jobs yet"
                  : `No ${filter} applications to show`}
              </p>
              <Button onClick={() => (window.location.href = "/find-jobs")}>
                Browse Available Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
