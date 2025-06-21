import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to monitoring service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="error-container p-8 max-w-lg text-center">
            <div className="error-icon text-6xl mb-4">⚠️</div>
            <h2 className="error-title text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="error-message text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details className="error-details text-left mb-6">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Development)
                </summary>
                <div className="error-stack bg-gray-100 p-4 rounded text-xs text-gray-700 overflow-auto max-h-40">
                  <p className="font-medium mb-2">
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}

            <div className="error-actions flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="refresh-button bg-blue-600 hover:bg-blue-700 text-white"
              >
                Refresh Page
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="home-button"
              >
                Go Home
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
