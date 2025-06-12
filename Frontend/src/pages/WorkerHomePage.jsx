import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchWorkerBookings } from "../features/bookingSlice";

function WorkerHomePage() {
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === "worker") {
      dispatch(fetchWorkerBookings());
    }
  }, [user, dispatch]);

  if (user && user.role !== "worker") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600">
              This page is only accessible to workers.
            </p>
            <Button
              onClick={() =>
                (window.location.href =
                  user.role === "customer" ? "/customer-home" : "/")
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Go to {user.role === "customer" ? "Customer" : "Home"} Page
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

export default WorkerHomePage;