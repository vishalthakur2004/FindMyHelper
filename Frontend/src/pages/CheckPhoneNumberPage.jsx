import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function CheckPhoneNumber() {
  const [phone, setPhone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
  
    const phoneNumber = "+91" + phone;
    setPhoneNumber(phoneNumber);
  
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/check-availability`, { phoneNumber });
      await axios.post(`${import.meta.env.VITE_API_URL}/user/send-otp`, { phoneNumber });

      setOtpSent(true);
      setError("");
      alert("OTP sent to your phone number");
  
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(
          <>
            Phone number already registered.{" "}
            <Link href="/login" className="text-orange-500 font-semibold underline hover:text-orange-600">
              Login here
            </Link>.
          </>
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };  

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    const isVerified = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, { phoneNumber, otp });
    setIsVerifying(false);
    if (isVerified.status === 200) {
      const token = isVerified.data?.token;
      navigate("/register-option", { state: { phoneNumber, token } });
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/user/send-otp`, { phoneNumber });
      alert("OTP sent to your phone number");
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-white to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">
            {otpSent ? "Enter OTP" : "Enter Your Phone Number"}
          </h2>

          {!otpSent ? (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhone(value);
                    setError("");
                  } else {
                    setError("Only digits are allowed.");
                  }
                }}
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <Button
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl text-lg"
                onClick={handleCheck}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <Button
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl text-lg mb-2"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
              <button
                className="text-sm text-orange-500 underline hover:text-orange-600"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </>
          )}
          <p className="pt-4">Already have an account? <Link to="/login" className="text-orange-500 font-semibold underline hover:text-orange-600">Login here</Link>.</p>
        </div>
      </div>
    </>
  );
}