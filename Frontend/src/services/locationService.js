import api from "./api";

class LocationService {
  constructor() {
    this.currentPosition = null;
    this.watchId = null;
    this.locationCache = new Map();
  }

  // Get user's current location with permission handling
  async getCurrentLocation(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
      ...options,
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
          };
          resolve(this.currentPosition);
        },
        (error) => {
          const errorMessages = {
            1: "Location access denied by user",
            2: "Location position unavailable",
            3: "Location request timeout",
          };
          reject(
            new Error(errorMessages[error.code] || "Unknown geolocation error"),
          );
        },
        defaultOptions,
      );
    });
  }

  // Check if location permission is granted
  async checkLocationPermission() {
    if (!navigator.permissions) {
      return "unknown";
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return "unknown";
    }
  }

  // Request location permission with user-friendly messaging
  async requestLocationPermission() {
    const permission = await this.checkLocationPermission();

    if (permission === "granted") {
      return await this.getCurrentLocation();
    }

    if (permission === "denied") {
      throw new Error(
        "Location permission denied. Please enable location access in your browser settings.",
      );
    }

    // Permission is 'prompt' or 'unknown', request location
    return await this.getCurrentLocation();
  }

  // Watch user's position for real-time updates
  watchPosition(successCallback, errorCallback, options = {}) {
    if (!navigator.geolocation) {
      errorCallback(new Error("Geolocation is not supported"));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000, // 1 minute for watching
      ...options,
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };
        successCallback(this.currentPosition);
      },
      errorCallback,
      defaultOptions,
    );

    return this.watchId;
  }

  // Stop watching position
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  toRad(value) {
    return (value * Math.PI) / 180;
  }

  // Convert distance to human-readable format
  formatDistance(distance) {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    } else {
      return `${Math.round(distance)}km`;
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    const cacheKey = `geocode_${address}`;

    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey);
    }

    try {
      const response = await api.get(
        `/location/geocode?address=${encodeURIComponent(address)}`,
      );
      const result = response.data;

      this.locationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      // Fallback to browser's geolocation if API fails
      console.warn("Geocoding API failed, using fallback");
      throw new Error("Unable to find location for this address");
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude, longitude) {
    const cacheKey = `reverse_${latitude}_${longitude}`;

    if (this.locationCache.has(cacheKey)) {
      return this.locationCache.get(cacheKey);
    }

    try {
      const response = await api.get(
        `/location/reverse-geocode?lat=${latitude}&lng=${longitude}`,
      );
      const result = response.data;

      this.locationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.warn("Reverse geocoding failed");
      return {
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        city: "Unknown",
        state: "Unknown",
        country: "Unknown",
      };
    }
  }

  // Get nearby workers
  async getNearbyWorkers(latitude, longitude, radius = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        lat: latitude,
        lng: longitude,
        radius,
        ...filters,
      });

      const response = await api.get(
        `/users/workers/nearby?${params.toString()}`,
      );

      // Add distance to each worker
      const workersWithDistance = response.data.workers.map((worker) => {
        if (worker.location && worker.location.coordinates) {
          const [workerLng, workerLat] = worker.location.coordinates;
          const distance = this.calculateDistance(
            latitude,
            longitude,
            workerLat,
            workerLng,
          );
          return {
            ...worker,
            distance,
            distanceFormatted: this.formatDistance(distance),
          };
        }
        return worker;
      });

      // Sort by distance
      workersWithDistance.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity),
      );

      return {
        ...response.data,
        workers: workersWithDistance,
      };
    } catch (error) {
      throw new Error("Failed to fetch nearby workers");
    }
  }

  // Get nearby jobs
  async getNearbyJobs(latitude, longitude, radius = 25, filters = {}) {
    try {
      const params = new URLSearchParams({
        lat: latitude,
        lng: longitude,
        radius,
        ...filters,
      });

      const response = await api.get(`/jobs/nearby?${params.toString()}`);

      // Add distance to each job
      const jobsWithDistance = response.data.jobs.map((job) => {
        if (job.location && job.location.coordinates) {
          const [jobLng, jobLat] = job.location.coordinates;
          const distance = this.calculateDistance(
            latitude,
            longitude,
            jobLat,
            jobLng,
          );
          return {
            ...job,
            distance,
            distanceFormatted: this.formatDistance(distance),
          };
        }
        return job;
      });

      // Sort by distance
      jobsWithDistance.sort(
        (a, b) => (a.distance || Infinity) - (b.distance || Infinity),
      );

      return {
        ...response.data,
        jobs: jobsWithDistance,
      };
    } catch (error) {
      throw new Error("Failed to fetch nearby jobs");
    }
  }

  // Save user's preferred location
  async saveUserLocation(latitude, longitude, address) {
    try {
      const response = await api.post("/users/location", {
        latitude,
        longitude,
        address,
        timestamp: Date.now(),
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to save location");
    }
  }

  // Get saved user locations
  async getSavedLocations() {
    try {
      const response = await api.get("/users/locations");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  // Check if location is fresh (not older than specified minutes)
  isLocationFresh(timestamp, maxAgeMinutes = 5) {
    if (!timestamp) return false;
    const maxAge = maxAgeMinutes * 60 * 1000; // Convert to milliseconds
    return Date.now() - timestamp < maxAge;
  }

  // Get cached location if fresh, otherwise request new one
  async getFreshLocation(maxAgeMinutes = 5) {
    if (
      this.currentPosition &&
      this.isLocationFresh(this.currentPosition.timestamp, maxAgeMinutes)
    ) {
      return this.currentPosition;
    }

    return await this.getCurrentLocation();
  }
}

export const locationService = new LocationService();
export default locationService;
