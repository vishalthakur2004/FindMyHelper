import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { logoutUser, clearCredentials } from "../store/slices/userSlice";
import { useToast } from "../hooks/useToast";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        showSuccess("Logged out successfully");
      } catch (error) {
        // Even if logout fails on server, clear local credentials
        dispatch(clearCredentials());
      } finally {
        navigate("/", { replace: true });
      }
    };

    performLogout();
  }, [dispatch, navigate, showSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
