import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthLayout = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading) {
      if (authentication && !isAuthenticated) {
        // Protected route but user not authenticated
        navigate("/login");
      } else if (!authentication && isAuthenticated) {
        // Public route but user is authenticated, redirect to dashboard
        navigate("/dashboard");
      }
    }
  }, [authentication, isAuthenticated, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication check fails
  if (authentication && !isAuthenticated) {
    return null;
  }

  if (!authentication && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthLayout;
