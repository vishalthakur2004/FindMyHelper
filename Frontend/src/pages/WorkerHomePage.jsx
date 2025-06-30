import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Star,
  DollarSign,
  Clock,
  Eye,
  TrendingUp,
  Navigation,
  Target,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import LocationPermission from "../components/LocationPermission";
import { fetchBookings } from "../store/slices/bookingSlice";
import { fetchJobs } from "../store/slices/jobSlice";
import { locationService } from "../services/locationService";

const WorkerHomePage = () => {
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyJobsCount, setNearbyJobsCount] = useState(0);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { bookings, loading: bookingsLoading } = useSelector(
    (state) => state.bookings,
  );
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchBookings({ limit: 5 }));
    dispatch(fetchJobs({ limit: 10 }));
    checkLocationAndShowNearbyJobs();
  }, [dispatch]);

  const checkLocationAndShowNearbyJobs = async () => {
    try {
      const permission = await locationService.checkLocationPermission();
      if (permission === "granted") {
        const position = await locationService.getFreshLocation();
        setCurrentLocation(position);

        // Get nearby jobs count for display
        try {
          const nearbyData = await locationService.getNearbyJobs(
            position.latitude,
            position.longitude,
            25,
          );
          setNearbyJobsCount(nearbyData.jobs?.length || 0);
        } catch (error) {
          console.log("Failed to get nearby jobs count");
        }
      }
    } catch (error) {
      console.log("Location check failed:", error);
    }
  };

  const handleLocationGranted = (location) => {
    setCurrentLocation(location);
    setShowLocationPermission(false);
    checkLocationAndShowNearbyJobs();
  };

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" || booking.status === "in_progress",
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  );
  const totalEarnings = completedBookings.reduce(
    (sum, booking) => sum + (booking.amount || 0),
    0,
  );

  const stats = {
    totalBookings: bookings.length,
    completedJobs: completedBookings.length,
    rating: userInfo?.rating || 0,
    totalEarnings: totalEarnings,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">ServiceConnect</h1>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/find-jobs"
                className="text-gray-600 hover:text-gray-900"
              >
                Find Jobs
              </Link>
              <Link
                to="/job-applications"
                className="text-gray-600 hover:text-gray-900"
              >
                Applications
              </Link>
              <Link to="/reviews" className="text-gray-600 hover:text-gray-900">
                Reviews
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Link to="/logout">
                <Button variant="outline">Logout</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userInfo?.fullName?.split(" ")[0] || "Provider"}!
          </h1>
          <p className="text-gray-600">
            Manage your services and grow your business
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Jobs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedJobs}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.rating.toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Earnings
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>

              {/* Location-based prompt */}
              {!currentLocation && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">
                        Find Jobs Near You
                      </h4>
                      <p className="text-sm text-green-700 mb-3">
                        Enable location access to discover job opportunities in
                        your area
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowLocationPermission(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Enable Location
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby jobs indicator */}
              {currentLocation && nearbyJobsCount > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {nearbyJobsCount} jobs nearby
                      </span>
                    </div>
                    <Link to="/find-jobs">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/find-jobs">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                    <Briefcase className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      Find Jobs
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentLocation
                        ? "Browse jobs near you"
                        : "Browse available opportunities"}
                    </p>
                  </div>
                </Link>

                <Link to="/job-applications">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                    <Clock className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      Applications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Track your job applications
                    </p>
                  </div>
                </Link>

                <Link to="/profile">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                    <Star className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      Profile
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update your information
                    </p>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Upcoming Bookings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Bookings
              </h2>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {booking.service}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(
                              booking.scheduledDate,
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.scheduledTime}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${booking.amount}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Link to="/bookings">
                      <Button variant="outline">View All Bookings</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming bookings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Apply for jobs to get more bookings
                  </p>
                  <Link to="/find-jobs">
                    <Button>Find Jobs</Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Available Jobs */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Jobs
              </h2>
              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div
                      key={job._id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {job.title}
                        </h4>
                        <span className="text-lg font-semibold text-green-600">
                          ${job.budget}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {job.category}
                        </span>
                        <Link to={`/jobs/${job._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Link to="/find-jobs">
                      <Button variant="outline">Browse All Jobs</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs available
                  </h3>
                  <p className="text-gray-600">
                    Check back later for new opportunities
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-semibold text-gray-900">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On-time Rate</span>
                  <span className="font-semibold text-green-600">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Repeat Customers</span>
                  <span className="font-semibold text-blue-600">75%</span>
                </div>
              </div>
            </Card>

            {/* Earnings This Month */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Earnings</span>
                  <span className="font-semibold text-gray-900">$1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-green-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours Worked</span>
                  <span className="font-semibold text-blue-600">32</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+15% from last month</span>
                </div>
              </div>
            </Card>

            {/* Profile Completeness */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Completeness</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Complete your profile to get more job opportunities
                </p>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Update Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Support */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get tips on how to improve your success rate and earnings.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Location Permission Modal */}
      <LocationPermission
        showModal={showLocationPermission}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={() => setShowLocationPermission(false)}
        onClose={() => setShowLocationPermission(false)}
      />
    </div>
  );
};

export default WorkerHomePage;
