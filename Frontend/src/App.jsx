import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import CheckPhoneNumber from "./pages/CheckPhoneNumberPage.jsx";
import RegisterOption from "./pages/RegistrationOptionsPage.jsx";
import RegisterWorker from "./pages/RegisterWorkerPage.jsx";
import RegisterCustomer from "./pages/RegisterCustomerPage.jsx";
import AboutUs from "./pages/AboutUsPage.jsx";
import HowItWorks from "./pages/HowItWorksPage.jsx";
import Services from "./pages/ServicesPage.jsx";
import Contact from "./pages/ContactPage.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/check-phone-number" element={<CheckPhoneNumber />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-option" element={<RegisterOption />} />
        <Route path="/register-worker" element={<RegisterWorker />} /> 
        <Route paht="/register-customer" element={<RegisterCustomer />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
