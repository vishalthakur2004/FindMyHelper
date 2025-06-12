import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import CheckPhoneNumber from "./pages/CheckPhoneNumberPage.jsx";
import RegisterOption from "./pages/RegistrationOptionsPage.jsx";
import RegisterWorker from "./pages/RegisterWorkerPage.jsx";
import RegisterCustomer from "./pages/RegisterCustomerPage.jsx";
import AboutUs from "./pages/AboutUsPage.jsx";
import HowItWorks from "./pages/HowItWorksPage.jsx";
import Services from "./pages/ServicesPage.jsx";
import Contact from "./pages/ContactPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import CustomerHomePage from "./pages/CustomerHomePage.jsx";
import WorkerHomePage from "./pages/WorkerHomePage.jsx";
import IntegrationTestPage from "./pages/IntegrationTestPage.jsx";

// Layout
import AuthLayout from "./components/authLayout.jsx";

// Dashboard redirection based on role
function DashboardRedirect() {
  const { userInfo } = useSelector((state) => state.user);

  if (userInfo?.role === "customer") {
    return <Navigate to="/customer-home" replace />;
  } else if (userInfo?.role === "worker") {
    return <Navigate to="/worker-home" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
}

function App() {

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AuthLayout authentication={false}>
            <LandingPage />
          </AuthLayout>
        }
      />
      <Route
        path="/check-phone-number"
        element={
          <AuthLayout authentication={false}>
            <CheckPhoneNumber />
          </AuthLayout>
        }
      />
      <Route
        path="/register-option"
        element={
          <AuthLayout authentication={false}>
            <RegisterOption />
          </AuthLayout>
        }
      />
      <Route
        path="/register-customer"
        element={
          <AuthLayout authentication={false}>
            <RegisterCustomer />
          </AuthLayout>
        }
      />
      <Route
        path="/register-worker"
        element={
          <AuthLayout authentication={false}>
            <RegisterWorker />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        }
      />

      {/* Authenticated Routes */}
      <Route
        path="/dashboard"
        element={
          <AuthLayout authentication={true}>
            <DashboardRedirect />
          </AuthLayout>
        }
      />
      <Route
        path="/customer-home"
        element={
          <AuthLayout authentication={true}>
            <CustomerHomePage />
          </AuthLayout>
        }
      />
      <Route
        path="/worker-home"
        element={
          <AuthLayout authentication={true}>
            <WorkerHomePage />
          </AuthLayout>
        }
      />
      <Route
        path="/test-integration"
        element={
          <AuthLayout authentication={true}>
            <IntegrationTestPage />
          </AuthLayout>
        }
      />
      <Route
        path="/logout"
        element={
          <AuthLayout authentication={true}>
            <LogoutPage />
          </AuthLayout>
        }
      />

      {/* Informational Pages (No Auth Required) */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

