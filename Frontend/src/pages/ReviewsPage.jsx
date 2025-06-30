import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Star, Calendar, User, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("received"); // received or given
  const { userInfo } = useSelector((state) => state.user);

  // Mock data for demonstration
  useEffect(() => {
    setReviews([
      {
        id: 1,
        rating: 5,
        comment:
          "Excellent service! Very professional and completed the job perfectly.",
        reviewer: { name: "Sarah Johnson" },
        service: "House Cleaning",
        date: "2024-01-15",
        type: "received",
      },
      {
        id: 2,
        rating: 4,
        comment: "Good work overall, arrived on time and was courteous.",
        reviewer: { name: "Mike Chen" },
        service: "Plumbing Repair",
        date: "2024-01-10",
        type: "received",
      },
      {
        id: 3,
        rating: 5,
        comment: "Great communication and quality work. Highly recommend!",
        reviewer: { name: "Emily Davis" },
        service: "Garden Maintenance",
        date: "2024-01-08",
        type: "given",
      },
    ]);
  }, []);

  const filteredReviews = reviews.filter((review) => review.type === filter);

  const averageRating =
    filteredReviews.length > 0
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
        filteredReviews.length
      : 0;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Reviews</h1>
            <Button onClick={() => window.history.back()} variant="outline">
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Reviews</h1>

          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setFilter("received")}
              variant={filter === "received" ? "default" : "outline"}
              size="sm"
            >
              Reviews About Me (
              {reviews.filter((r) => r.type === "received").length})
            </Button>
            <Button
              onClick={() => setFilter("given")}
              variant={filter === "given" ? "default" : "outline"}
              size="sm"
            >
              Reviews I've Given (
              {reviews.filter((r) => r.type === "given").length})
            </Button>
          </div>

          {filteredReviews.length > 0 && (
            <Card className="p-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                </div>
                <p className="text-gray-600">
                  Average rating from {filteredReviews.length} review
                  {filteredReviews.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.reviewer.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Service: {review.service}
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>

              {filter === "received" && userInfo?.role === "worker" && (
                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Respond
                  </Button>
                </div>
              )}
            </Card>
          ))}

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No{" "}
                {filter === "received" ? "reviews about you" : "reviews given"}{" "}
                yet
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === "received"
                  ? "Complete more jobs to start receiving reviews"
                  : "Book services to leave reviews for providers"}
              </p>
              <Button
                onClick={() =>
                  (window.location.href =
                    userInfo?.role === "worker"
                      ? "/find-jobs"
                      : "/find-workers")
                }
              >
                {userInfo?.role === "worker" ? "Find Jobs" : "Book Services"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
