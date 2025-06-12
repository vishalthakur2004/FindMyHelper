import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { jobService } from "../services/jobService";
import { bookingService } from "../services/bookingService";
import { workerService } from "../services/workerService";
import { userService } from "../services/userService";
import { fetchNearbyJobs, createJob, applyForJob } from "../features/jobSlice";
import {
  fetchNearbyWorkers,
  createBooking,
  updateBookingStatus,
} from "../features/bookingSlice";

function IntegrationTestPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { nearbyJobs, loading: jobLoading } = useSelector(
    (state) => state.jobs,
  );
  const { nearbyWorkers, loading: bookingLoading } = useSelector(
    (state) => state.bookings,
  );

  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const logResult = (testName, success, message, data = null) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: {
        success,
        message,
        data,
        timestamp: new Date().toLocaleTimeString(),
      },
    }));
  };

  // Test Job Service Functions
  const testJobService = async () => {
    setTesting(true);

    try {
      // Test create job
      const createJobResult = await jobService.createJob({
        title: "Test Plumbing Job",
        description: "Fix leaky faucet in kitchen",
        serviceCategory: "plumber",
        budget: 500,
        address: {
          street: "123 Test Street",
          city: "Test City",
          state: "Test State",
          pincode: "123456",
        },
      });
      logResult(
        "Create Job",
        createJobResult.success,
        createJobResult.message,
        createJobResult.data,
      );

      // Test fetch nearby jobs
      const nearbyJobsResult = await jobService.getNearbyJobs({
        location: "Test City",
        radius: 10,
      });
      logResult(
        "Fetch Nearby Jobs",
        nearbyJobsResult.success,
        `Found ${nearbyJobsResult.data?.length || 0} jobs`,
        nearbyJobsResult.data,
      );

      // Test get my job posts
      const myJobsResult = await jobService.getMyJobPosts();
      logResult(
        "Get My Job Posts",
        myJobsResult.success,
        `Found ${myJobsResult.data?.length || 0} job posts`,
        myJobsResult.data,
      );

      if (nearbyJobsResult.data && nearbyJobsResult.data.length > 0) {
        const testJob = nearbyJobsResult.data[0];

        // Test get job by ID
        const jobByIdResult = await jobService.getJobById(testJob._id);
        logResult(
          "Get Job By ID",
          jobByIdResult.success,
          jobByIdResult.message,
          jobByIdResult.data,
        );

        // Test apply for job (if user is worker)
        if (userInfo?.role === "worker") {
          const applyResult = await jobService.applyForJob(testJob._id, {
            proposedAmount: testJob.budget,
            message: "I can complete this job efficiently",
          });
          logResult(
            "Apply for Job",
            applyResult.success,
            applyResult.message,
            applyResult.data,
          );
        }
      }
    } catch (error) {
      logResult("Job Service Test", false, `Error: ${error.message}`);
    }
  };

  // Test Booking Service Functions
  const testBookingService = async () => {
    try {
      // Test fetch nearby workers
      const nearbyWorkersResult = await bookingService.getNearbyWorkers({
        location: "Test City",
        serviceCategory: "plumber",
        radius: 10,
      });
      logResult(
        "Fetch Nearby Workers",
        nearbyWorkersResult.success,
        `Found ${nearbyWorkersResult.data?.length || 0} workers`,
        nearbyWorkersResult.data,
      );

      // Test get customer bookings
      const customerBookingsResult = await bookingService.getCustomerBookings();
      logResult(
        "Get Customer Bookings",
        customerBookingsResult.success,
        `Found ${customerBookingsResult.data?.length || 0} bookings`,
        customerBookingsResult.data,
      );

      // Test get worker bookings
      const workerBookingsResult = await bookingService.getWorkerBookings();
      logResult(
        "Get Worker Bookings",
        workerBookingsResult.success,
        `Found ${workerBookingsResult.data?.length || 0} bookings`,
        workerBookingsResult.data,
      );

      // Test create booking (if user is customer and workers available)
      if (
        userInfo?.role === "customer" &&
        nearbyWorkersResult.data &&
        nearbyWorkersResult.data.length > 0
      ) {
        const testWorker = nearbyWorkersResult.data[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const createBookingResult = await bookingService.createBookingRequest({
          workerId: testWorker._id,
          serviceCategory: "plumber",
          scheduledDate: tomorrow.toISOString(),
          amount: 600,
          paymentMethod: "cash",
          description: "Test booking request",
        });
        logResult(
          "Create Booking Request",
          createBookingResult.success,
          createBookingResult.message,
          createBookingResult.data,
        );
      }
    } catch (error) {
      logResult("Booking Service Test", false, `Error: ${error.message}`);
    }
  };

  // Test Worker Service Functions
  const testWorkerService = async () => {
    try {
      // Test search workers
      const searchWorkersResult = await workerService.searchWorkers({
        location: "Test City",
        serviceCategory: "plumber",
        radius: 10,
      });
      logResult(
        "Search Workers",
        searchWorkersResult.success,
        `Found ${searchWorkersResult.data?.length || 0} workers`,
        searchWorkersResult.data,
      );

      if (searchWorkersResult.data && searchWorkersResult.data.length > 0) {
        const testWorker = searchWorkersResult.data[0];

        // Test get worker profile
        const workerProfileResult = await workerService.getWorkerProfile(
          testWorker._id,
        );
        logResult(
          "Get Worker Profile",
          workerProfileResult.success,
          workerProfileResult.message,
          workerProfileResult.data,
        );
      }

      // Test get worker stats (if user is worker)
      if (userInfo?.role === "worker") {
        const workerStatsResult = await workerService.getWorkerStats();
        logResult(
          "Get Worker Stats",
          workerStatsResult.success,
          workerStatsResult.message,
          workerStatsResult.data,
        );
      }
    } catch (error) {
      logResult("Worker Service Test", false, `Error: ${error.message}`);
    }
  };

  // Test User Service Functions
  const testUserService = async () => {
    try {
      // Test get current user
      const currentUserResult = await userService.getCurrentUser();
      logResult(
        "Get Current User",
        currentUserResult.success,
        currentUserResult.message,
        currentUserResult.data,
      );

      // Test check availability for a random number
      const randomPhone =
        "+91" + Math.floor(Math.random() * 9000000000 + 1000000000);
      const availabilityResult =
        await userService.checkAvailability(randomPhone);
      logResult(
        "Check Phone Availability",
        availabilityResult.success,
        `Phone ${randomPhone} availability checked`,
        availabilityResult.data,
      );
    } catch (error) {
      logResult("User Service Test", false, `Error: ${error.message}`);
    }
  };

  // Test Redux Actions
  const testReduxActions = async () => {
    try {
      // Test fetch nearby jobs action
      const nearbyJobsAction = await dispatch(
        fetchNearbyJobs({ location: "Test City" }),
      );
      logResult(
        "Redux: Fetch Nearby Jobs",
        fetchNearbyJobs.fulfilled.match(nearbyJobsAction),
        "Redux action completed",
        nearbyJobsAction.payload,
      );

      // Test fetch nearby workers action
      const nearbyWorkersAction = await dispatch(
        fetchNearbyWorkers({ location: "Test City" }),
      );
      logResult(
        "Redux: Fetch Nearby Workers",
        fetchNearbyWorkers.fulfilled.match(nearbyWorkersAction),
        "Redux action completed",
        nearbyWorkersAction.payload,
      );
    } catch (error) {
      logResult("Redux Actions Test", false, `Error: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults({});

    logResult(
      "Test Started",
      true,
      "Running comprehensive integration tests...",
    );

    await testUserService();
    await testJobService();
    await testBookingService();
    await testWorkerService();
    await testReduxActions();

    logResult("Test Completed", true, "All integration tests completed!");
    setTesting(false);
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Frontend-Backend Integration Test
          </h1>
          <p className="text-gray-600">
            Test all API connections and services integration
          </p>
          {userInfo && (
            <p className="text-sm text-blue-600 mt-2">
              Logged in as: {userInfo.fullName} ({userInfo.role})
            </p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={runAllTests}
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {testing ? "Running Tests..." : "Run All Tests"}
          </Button>
          <Button onClick={testJobService} disabled={testing} variant="outline">
            Test Job Service
          </Button>
          <Button
            onClick={testBookingService}
            disabled={testing}
            variant="outline"
          >
            Test Booking Service
          </Button>
          <Button
            onClick={testWorkerService}
            disabled={testing}
            variant="outline"
          >
            Test Worker Service
          </Button>
          <Button
            onClick={clearResults}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            Clear Results
          </Button>
        </div>

        {/* Test Results */}
        <div className="grid gap-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <Card
              key={testName}
              className={`p-4 ${
                result.success
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`font-semibold ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "✅" : "❌"} {testName}
                </h3>
                <span className="text-xs text-gray-500">
                  {result.timestamp}
                </span>
              </div>

              <p
                className={`text-sm mb-2 ${
                  result.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.message}
              </p>

              {result.data && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    View Data (
                    {typeof result.data === "object"
                      ? Array.isArray(result.data)
                        ? `${result.data.length} items`
                        : "object"
                      : typeof result.data}
                    )
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </Card>
          ))}
        </div>

        {/* Current Redux State */}
        <Card className="mt-8 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Current Redux State
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Jobs State</h4>
              <p>Nearby Jobs: {nearbyJobs.length}</p>
              <p>Loading: {jobLoading.nearbyJobs ? "Yes" : "No"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Bookings State</h4>
              <p>Nearby Workers: {nearbyWorkers.length}</p>
              <p>Loading: {bookingLoading.nearbyWorkers ? "Yes" : "No"}</p>
            </div>
          </div>
        </Card>

        {/* API Endpoints Status */}
        <Card className="mt-4 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            API Configuration
          </h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Base URL:</strong>{" "}
              {import.meta.env.VITE_API_URL || "http://localhost:3000/api"}
            </p>
            <p>
              <strong>User logged in:</strong> {userInfo ? "Yes" : "No"}
            </p>
            <p>
              <strong>User role:</strong> {userInfo?.role || "Not logged in"}
            </p>
            <p>
              <strong>Access token:</strong> {userInfo ? "Present" : "Missing"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default IntegrationTestPage;