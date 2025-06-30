import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Filter,
  Target,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import LocationSelector from "./LocationSelector";
import LocationPermission from "./LocationPermission";
import { useToast } from "../hooks/useToast";
import { locationService } from "../services/locationService";

const NearbySearch = ({
  type = "workers", // 'workers' or 'jobs'
  onResultsUpdate,
  filters = {},
  className = "",
}) => {
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { showSuccess, showError, showInfo } = useToast();

  const radiusOptions = [
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
    { value: 50, label: "50 km" },
    { value: 100, label: "100 km" },
  ];

  useEffect(() => {
    // Auto-detect location on component mount
    checkLocationPermission();
  }, []);

  useEffect(() => {
    // Search when location or radius changes
    if (searchLocation) {
      performNearbySearch();
    }
  }, [searchLocation, radius, filters]);

  const checkLocationPermission = async () => {
    try {
      const permission = await locationService.checkLocationPermission();
      if (permission === "granted") {
        await getCurrentLocation();
      } else if (permission === "prompt") {
        setShowLocationPermission(true);
      }
    } catch (error) {
      console.log("Location permission check failed:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const position = await locationService.getFreshLocation();
      const address = await locationService.reverseGeocode(
        position.latitude,
        position.longitude,
      );

      const location = {
        latitude: position.latitude,
        longitude: position.longitude,
        address:
          address.address ||
          `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`,
        city: address.city,
        state: address.state,
        isCurrent: true,
      };

      setCurrentLocation(location);
      setSearchLocation(location);
    } catch (error) {
      console.log("Failed to get current location:", error);
    }
  };

  const performNearbySearch = async () => {
    if (!searchLocation) return;

    setLoading(true);
    try {
      let data;

      if (type === "workers") {
        data = await locationService.getNearbyWorkers(
          searchLocation.latitude,
          searchLocation.longitude,
          radius,
          filters,
        );
        setResults(data.workers || []);

        showInfo(
          `Found ${data.workers?.length || 0} workers within ${radius}km`,
        );
      } else {
        data = await locationService.getNearbyJobs(
          searchLocation.latitude,
          searchLocation.longitude,
          radius,
          filters,
        );
        setResults(data.jobs || []);

        showInfo(`Found ${data.jobs?.length || 0} jobs within ${radius}km`);
      }

      onResultsUpdate?.(data);
    } catch (error) {
      showError(`Failed to search nearby ${type}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPermissionGranted = (location) => {
    setCurrentLocation(location);
    setSearchLocation(location);
    setShowLocationPermission(false);
    showSuccess("Location detected successfully");
  };

  const handleLocationPermissionDenied = () => {
    setShowLocationPermission(false);
    showInfo(`You can still search ${type} by entering a location manually`);
  };

  const handleLocationSelect = (location) => {
    setSearchLocation(location);
  };

  const requestLocationAccess = () => {
    setShowLocationPermission(true);
  };

  const formatLocationDisplay = (location) => {
    if (!location) return "No location selected";

    if (location.isCurrent) {
      return `📍 Current location: ${location.city || "Unknown"}, ${location.state || "Unknown"}`;
    }
    return location.address;
  };

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {type === "workers" ? (
            <Users className="h-5 w-5 text-blue-600" />
          ) : (
            <Briefcase className="h-5 w-5 text-blue-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">
            Find Nearby {type === "workers" ? "Workers" : "Jobs"}
          </h3>
        </div>

        <div className="space-y-4">
          {/* Location Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Location
            </label>
            <LocationSelector
              onLocationSelect={handleLocationSelect}
              currentLocation={searchLocation}
              placeholder={`Enter location to find nearby ${type}`}
              showCurrentLocationButton={true}
            />

            {searchLocation && (
              <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {formatLocationDisplay(searchLocation)}
              </p>
            )}
          </div>

          {/* Radius Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {radiusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Within {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!searchLocation ? (
              <Button onClick={requestLocationAccess} className="flex-1">
                <Navigation className="h-4 w-4 mr-2" />
                Enable Location Access
              </Button>
            ) : (
              <Button
                onClick={performNearbySearch}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Search Nearby
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={() => setShowLocationPermission(true)}
              variant="outline"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Results Summary */}
          {searchLocation && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {results.length} {type} found within {radius}km
                </span>
                {currentLocation &&
                  searchLocation &&
                  !searchLocation.isCurrent && (
                    <button
                      onClick={() => setSearchLocation(currentLocation)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Navigation className="h-4 w-4" />
                      Use current location
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Location Permission Modal */}
      <LocationPermission
        showModal={showLocationPermission}
        onLocationGranted={handleLocationPermissionGranted}
        onLocationDenied={handleLocationPermissionDenied}
        onClose={() => setShowLocationPermission(false)}
      />
    </div>
  );
};

export default NearbySearch;
