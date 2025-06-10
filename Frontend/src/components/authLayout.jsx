import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.user.status);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus) {
      if (userInfo?.role === "worker") {
        navigate("/worker-home");
      } else if (userInfo?.role === "customer") {
        navigate("/customer-home");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  }, [authStatus, userInfo, navigate, authentication]);

  return loading ? <h1>Loading...</h1> : <>{children}</>;
}

export default AuthLayout;