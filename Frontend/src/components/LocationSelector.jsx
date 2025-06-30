import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, Target, Clock, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "../hooks/useToast";
import { locationService } from "../services/locationService";

const LocationSelector = ({
  onLocationSelect,
  currentLocation,
  placeholder = "Enter location or use current location",
  showCurrentLocationButton = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentLocations, setRecentLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    loadRecentLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadRecentLocations = async () => {
    try {
      const locations = await locationService.getSavedLocations();
      setRecentLocations(locations.slice(0, 5)); // Show last 5 locations
    } catch (error) {
      // Fallback to localStorage
      const saved = localStorage.getItem("recentLocations");
      if (saved) {
        setRecentLocations(JSON.parse(saved).slice(0, 5));
      }
    }
  };

  const saveToRecentLocations = (location) => {
    const newLocation = {
      id: Date.now(),
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: Date.now(),
    };

    const updated = [
      newLocation,
      ...recentLocations.filter((l) => l.address !== location.address),
    ].slice(0, 5);
    setRecentLocations(updated);

    // Save to localStorage as fallback
    localStorage.setItem("recentLocations", JSON.stringify(updated));

    // Also try to save to backend
    locationService
      .saveUserLocation(location.latitude, location.longitude, location.address)
      .catch(() => {}); // Silent fail
  };

  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // Simulate search results - in real app, this would call a geocoding API
      const mockResults = [
        {
          id: 1,
          address: `${query}, San Francisco, CA`,
          description: "San Francisco, California, USA",
          latitude: 37.7749 + Math.random() * 0.1,
          longitude: -122.4194 + Math.random() * 0.1,
        },
        {
          id: 2,
          address: `${query}, Oakland, CA`,
          description: "Oakland, California, USA",
          latitude: 37.8044 + Math.random() * 0.1,
          longitude: -122.2711 + Math.random() * 0.1,
        },
        {
          id: 3,
          address: `${query}, Berkeley, CA`,
          description: "Berkeley, California, USA",
          latitude: 37.8715 + Math.random() * 0.1,
          longitude: -122.273 + Math.random() * 0.1,
        },
      ];

      // Add delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSearchResults(mockResults);
    } catch (error) {
      showError("Failed to search locations");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setGettingCurrentLocation(true);
    try {
      const position = await locationService.requestLocationPermission();
      const address = await locationService.reverseGeocode(
        position.latitude,
        position.longitude,
      );

      const location = {
        address:
          address.address ||
          `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`,
        latitude: position.latitude,
        longitude: position.longitude,
        city: address.city,
        state: address.state,
        isCurrent: true,
      };

      saveToRecentLocations(location);
      onLocationSelect(location);
      setIsOpen(false);
      showSuccess("Current location detected");
    } catch (error) {
      showError(error.message);
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  const selectLocation = (location) => {
    saveToRecentLocations(location);
    onLocationSelect(location);
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const clearCurrentLocation = () => {
    onLocationSelect(null);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={
                currentLocation ? currentLocation.address : placeholder
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchLocations(e.target.value);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {currentLocation && (
              <button
                onClick={clearCurrentLocation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showCurrentLocationButton && (
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={gettingCurrentLocation}
              variant="outline"
              className="px-3"
            >
              {gettingCurrentLocation ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 p-0 max-h-80 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Searching locations...</p>
            </div>
          )}

          {!loading && searchQuery && searchResults.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Results
                </h4>
              </div>
              {searchResults.map((location) => (
                <button
                  key={location.id}
                  onClick={() => selectLocation(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {location.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {location.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !searchQuery && recentLocations.length > 0 && (
            <div>
              <div className="px-4 py-2 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Locations
                </h4>
              </div>
              {recentLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => selectLocation(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {location.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(location.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showCurrentLocationButton && (
            <div className="border-t border-gray-200">
              <button
                onClick={getCurrentLocation}
                disabled={gettingCurrentLocation}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
              >
                {gettingCurrentLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <Target className="h-4 w-4 text-blue-600" />
                )}
                <span className="font-medium text-blue-600">
                  {gettingCurrentLocation
                    ? "Getting current location..."
                    : "Use current location"}
                </span>
              </button>
            </div>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p>No locations found for "{searchQuery}"</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          {!loading && !searchQuery && recentLocations.length === 0 && (
            <div className="p-4 text-center text-gray-600">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm">Start typing to search for locations</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default LocationSelector;
