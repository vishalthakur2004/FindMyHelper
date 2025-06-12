import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import axiosInstance from "../utils/axiosInterceptor";

function ApiConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    status: "checking",
    message: "Checking connection...",
    lastChecked: null,
  });

  const checkConnection = async () => {
    try {
      setConnectionStatus({
        status: "checking",
        message: "Checking connection...",
        lastChecked: null,
      });

      // Try to hit a simple endpoint to check connection
      const response = await axiosInstance.get("/users/check-availability", {
        timeout: 5000,
      });

      setConnectionStatus({
        status: "connected",
        message: "Connected to backend API",
        lastChecked: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error("API connection check failed:", error);

      let message = "Failed to connect to backend API";
      if (error.code === "ECONNREFUSED") {
        message = "Backend server is not running";
      } else if (error.code === "NETWORK_ERROR") {
        message = "Network connection error";
      } else if (error.response?.status) {
        message = `Backend responded with status ${error.response.status}`;
      }

      setConnectionStatus({
        status: "disconnected",
        message,
        lastChecked: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case "connected":
        return "border-green-500 bg-green-50 text-green-800";
      case "disconnected":
        return "border-red-500 bg-red-50 text-red-800";
      case "checking":
        return "border-yellow-500 bg-yellow-50 text-yellow-800";
      default:
        return "border-gray-500 bg-gray-50 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case "connected":
        return "🟢";
      case "disconnected":
        return "🔴";
      case "checking":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <Card className={`p-3 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div>
            <p className="font-medium text-sm">API Status</p>
            <p className="text-xs">{connectionStatus.message}</p>
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={checkConnection}
            className="text-xs px-2 py-1 rounded border hover:bg-white/50 transition-colors"
            disabled={connectionStatus.status === "checking"}
          >
            Refresh
          </button>
          {connectionStatus.lastChecked && (
            <p className="text-xs mt-1">Last: {connectionStatus.lastChecked}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ApiConnectionStatus;