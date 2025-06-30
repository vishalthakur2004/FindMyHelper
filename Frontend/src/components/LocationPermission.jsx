import { useState, useEffect } from "react";
import { MapPin, Navigation, AlertCircle, Settings, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useToast } from "../hooks/useToast";
import { locationService } from "../services/locationService";

const LocationPermission = ({
  onLocationGranted,
  onLocationDenied,
  showModal = true,
  onClose,
}) => {
  const [permissionState, setPermissionState] = useState("checking");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permission = await locationService.checkLocationPermission();
      setPermissionState(permission);

      if (permission === "granted") {
        // Auto-get location if already granted
        await getCurrentLocation();
      }
    } catch (error) {
      setPermissionState("unknown");
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const position = await locationService.getCurrentLocation();
      const address = await locationService.reverseGeocode(
        position.latitude,
        position.longitude,
      );

      showSuccess("Location access granted successfully");
      onLocationGranted?.({
        ...position,
        address: address.address,
        city: address.city,
        state: address.state,
      });
    } catch (error) {
      showError(error.message);
      onLocationDenied?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const position = await locationService.requestLocationPermission();
      const address = await locationService.reverseGeocode(
        position.latitude,
        position.longitude,
      );

      showSuccess("Location access granted successfully");
      setPermissionState("granted");
      onLocationGranted?.({
        ...position,
        address: address.address,
        city: address.city,
        state: address.state,
      });
    } catch (error) {
      showError(error.message);
      setPermissionState("denied");
      onLocationDenied?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openLocationSettings = () => {
    showError(
      "Please enable location access in your browser settings and refresh the page",
    );
  };

  if (!showModal || permissionState === "granted") {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>

          {permissionState === "checking" && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Checking Location Access
              </h3>
              <p className="text-gray-600 mb-6">
                Please wait while we check your location permissions...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </>
          )}

          {permissionState === "prompt" && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enable Location Access
              </h3>
              <p className="text-gray-600 mb-6">
                We need access to your location to show you nearby services and
                opportunities. Your location data is only used to improve your
                experience and is never shared.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Navigation className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Find workers and jobs near you</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Show accurate travel times and distances</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Your privacy is protected - location is never shared
                    publicly
                  </span>
                </div>
              </div>

              <Button
                onClick={requestPermission}
                disabled={loading}
                className="w-full mb-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Allow Location Access
                  </>
                )}
              </Button>

              {onClose && (
                <Button onClick={onClose} variant="outline" className="w-full">
                  Continue Without Location
                </Button>
              )}
            </>
          )}

          {permissionState === "denied" && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location Access Denied
              </h3>
              <p className="text-gray-600 mb-6">
                Location access is currently blocked. To use location-based
                features, please enable location access in your browser
                settings.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">How to enable location:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        Click the location icon in your browser's address bar
                      </li>
                      <li>Select "Allow" or "Always allow"</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={requestPermission}
                  disabled={loading}
                  className="w-full"
                >
                  Try Again
                </Button>

                <Button
                  onClick={openLocationSettings}
                  variant="outline"
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings Guide
                </Button>

                {onClose && (
                  <Button onClick={onClose} variant="ghost" className="w-full">
                    Continue Without Location
                  </Button>
                )}
              </div>
            </>
          )}

          {permissionState === "unknown" && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Location Not Available
              </h3>
              <p className="text-gray-600 mb-6">
                Your browser doesn't support location services or location
                access is not available.
              </p>

              {onClose && (
                <Button onClick={onClose} className="w-full">
                  Continue Without Location
                </Button>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LocationPermission;
