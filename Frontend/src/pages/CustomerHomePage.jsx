import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Star,
  MapPin,
  Clock,
  Plus,
  Navigation,
  Target,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import LocationPermission from "../components/LocationPermission";
import { fetchBookings } from "../store/slices/bookingSlice";
import { locationService } from "../services/locationService";
import { JOB_CATEGORIES } from "../constants";

const CustomerHomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyWorkersCount, setNearbyWorkersCount] = useState(0);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings({ limit: 5 }));
    checkLocationAndShowNearbyFeatures();
  }, [dispatch]);

  const checkLocationAndShowNearbyFeatures = async () => {
    try {
      const permission = await locationService.checkLocationPermission();
      if (permission === "granted") {
        const position = await locationService.getFreshLocation();
        setCurrentLocation(position);

        // Get nearby workers count for display
        try {
          const nearbyData = await locationService.getNearbyWorkers(
            position.latitude,
            position.longitude,
            10,
          );
          setNearbyWorkersCount(nearbyData.workers?.length || 0);
        } catch (error) {
          console.log("Failed to get nearby workers count");
        }
      }
    } catch (error) {
      console.log("Location check failed:", error);
    }
  };

  const handleLocationGranted = (location) => {
    setCurrentLocation(location);
    setShowLocationPermission(false);
    checkLocationAndShowNearbyFeatures();
  };

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending",
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/find-workers?search=${encodeURIComponent(searchQuery)}`;
    }
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
                to="/find-workers"
                className="text-gray-600 hover:text-gray-900"
              >
                Find Workers
              </Link>
              <Link
                to="/bookings"
                className="text-gray-600 hover:text-gray-900"
              >
                My Bookings
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
            Welcome back, {userInfo?.fullName?.split(" ")[0] || "Customer"}!
          </h1>
          <p className="text-gray-600">
            Find trusted professionals for all your service needs
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
            </div>
          </form>
        </Card>

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
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">
                        Find Workers Near You
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Enable location access to discover trusted professionals
                        in your area
                      </p>
                      <Button
                        size="sm"
                        onClick={() => setShowLocationPermission(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Enable Location
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby workers indicator */}
              {currentLocation && nearbyWorkersCount > 0 && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        {nearbyWorkersCount} workers nearby
                      </span>
                    </div>
                    <Link to="/find-workers">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-300 text-green-700"
                      >
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Link to="/find-workers">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                    <Search className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      Find Workers
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentLocation
                        ? "Browse workers near you"
                        : "Browse available service providers"}
                    </p>
                  </div>
                </Link>

                <Link to="/bookings">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group">
                    <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      My Bookings
                    </h3>
                    <p className="text-sm text-gray-600">
                      View your scheduled services
                    </p>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Popular Services */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Popular Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {JOB_CATEGORIES.slice(0, 8).map((category) => (
                  <Link
                    key={category}
                    to={`/find-workers?category=${encodeURIComponent(category)}`}
                    className="p-3 text-center rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <span className="text-blue-600 font-semibold">
                        {category.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {category}
                    </h3>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
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
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
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
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by finding a service provider
                  </p>
                  <Link to="/find-workers">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Book a Service
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold text-gray-900">
                    {bookings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  Check worker ratings and reviews before booking
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Choose providers near your location for faster service
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Book in advance for better availability
                </li>
              </ul>
            </Card>

            {/* Support */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help you with any questions.
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

export default CustomerHomePage;
