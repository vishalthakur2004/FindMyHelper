import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import JobList from "../components/JobList";
import WorkerList from "../components/WorkerList";
import BookingList from "../components/BookingList";
import JobPostForm from "../components/JobPostForm";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchCustomerBookings } from "../features/bookingSlice";
import { fetchMyJobPosts } from "../features/jobSlice";

function CustomerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize data when component mounts
    if (user?.role === "customer") {
      dispatch(fetchCustomerBookings());
      dispatch(fetchMyJobPosts());
    }
  }, [user, dispatch]);

  if (user && user.role !== "customer") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              This page is only accessible to customers.
            </p>
            <Button
              onClick={() =>
                (window.location.href =
                  user.role === "worker" ? "/worker-home" : "/")
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to {user.role === "worker" ? "Worker" : "Home"} Page
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Dashboard />
    </div>
  );
}

export default CustomerHomePage;