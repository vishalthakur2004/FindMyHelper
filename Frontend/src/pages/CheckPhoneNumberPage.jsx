import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { userService } from "../services/userService";

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
      // Check availability first
      const availabilityResult =
        await userService.checkAvailability(phoneNumber);

      if (!availabilityResult.success) {
        setError(
          <>
            Phone number already registered.{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold underline hover:text-orange-600"
            >
              Login here
            </Link>.
          </>
        );
        return;
      }

      // Send OTP
      const otpResult = await userService.sendOtp(phoneNumber);

      if (otpResult.success) {
        setOtpSent(true);
        setError("");
        alert("OTP sent to your phone number");
      } else {
        setError(otpResult.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Phone check error:", err);
      setError("Something went wrong. Please try again.");
    }
  };  

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    try {
      const result = await userService.verifyOtp(phoneNumber, otp);

      if (result.success) {
        const token = result.data?.token;
        navigate("/register-option", { state: { phoneNumber, token } });
      } else {
        setError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await userService.sendOtp(phoneNumber);

      if (result.success) {
        alert("OTP sent to your phone number");
        setError("");
      } else {
        alert(result.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      alert("Something went wrong. Please try again.");
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