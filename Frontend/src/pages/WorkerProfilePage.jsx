import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Star,
  MapPin,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const WorkerProfilePage = () => {
  const { workerId } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setWorker({
      id: workerId,
      fullName: "John Smith",
      category: "Plumbing",
      rating: 4.8,
      reviewCount: 47,
      hourlyRate: 65,
      experience: "8 years",
      location: "San Francisco, CA",
      bio: "Professional plumber with over 8 years of experience. Specializing in residential and commercial plumbing repairs, installations, and maintenance.",
      skills: [
        "Pipe Repair",
        "Drain Cleaning",
        "Water Heater Installation",
        "Leak Detection",
        "Emergency Repairs",
      ],
      verified: true,
      responseTime: "2 hours",
      completionRate: 98,
    });

    setReviews([
      {
        id: 1,
        rating: 5,
        comment:
          "Excellent work! Fixed my leaky faucet quickly and professionally.",
        reviewer: "Sarah Johnson",
        date: "2024-01-15",
        service: "Faucet Repair",
      },
      {
        id: 2,
        rating: 4,
        comment:
          "Very knowledgeable and arrived on time. Good value for money.",
        reviewer: "Mike Chen",
        date: "2024-01-10",
        service: "Pipe Installation",
      },
      {
        id: 3,
        rating: 5,
        comment: "Great communication and clean work. Would hire again!",
        reviewer: "Emily Davis",
        date: "2024-01-08",
        service: "Drain Cleaning",
      },
    ]);

    setLoading(false);
  }, [workerId]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Worker not found
          </h3>
          <p className="text-gray-600">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Worker Profile</h1>
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {worker.fullName}
                </h2>
                <p className="text-gray-600 mb-2">
                  {worker.category} Professional
                </p>

                <div className="flex items-center justify-center gap-1 mb-4">
                  {renderStars(Math.round(worker.rating))}
                  <span className="ml-1 font-medium">{worker.rating}</span>
                  <span className="text-gray-600">
                    ({worker.reviewCount} reviews)
                  </span>
                </div>

                {worker.verified && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ✓ Verified Professional
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{worker.experience} experience</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {worker.completionRate}%
                    </p>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {worker.responseTime}
                    </p>
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Worker
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Service
                </Button>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  ${worker.hourlyRate}
                </p>
                <p className="text-gray-600">per hour</p>
                <p className="text-sm text-gray-500 mt-2">
                  Starting rate - final price may vary
                </p>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
            </Card>

            {/* Skills & Expertise */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Reviews ({reviews.length})
              </h3>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.reviewer}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {review.service}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfilePage;
