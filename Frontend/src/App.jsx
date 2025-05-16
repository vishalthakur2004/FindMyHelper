import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
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
import AuthLayout from "./components/authLayout.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <AuthLayout authentication={false}>
            <LandingPage />
          </AuthLayout>
        } />
        <Route path="/home" element={
          <AuthLayout>
            <HomePage />
          </AuthLayout>
        } />
        <Route path="/check-phone-number" element={
          <AuthLayout authentication={false}>
            <CheckPhoneNumber />
          </AuthLayout>
        } />
        <Route path="/register-option" element={
          <AuthLayout authentication={false}>
            <RegisterOption />
          </AuthLayout>
        } />
        <Route path="/register-customer" element={
          <AuthLayout authentication={false}>
            <RegisterCustomer />
          </AuthLayout>
        } />
        <Route path="/register-worker" element={
          <AuthLayout authentication={false}>
            <RegisterWorker />
          </AuthLayout>
        } /> 
        <Route path="/login" element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        } />
        <Route path="/logout" element={
          <AuthLayout authentication>
            <LogoutPage />
          </AuthLayout>
        } />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
