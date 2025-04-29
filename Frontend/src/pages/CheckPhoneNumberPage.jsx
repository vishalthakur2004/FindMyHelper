import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";

export default function CheckPhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleCheck = async () => {
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const fullPhoneNumber = "+91" + phoneNumber;

    try {
      const isRegistered = await fakeCheckPhoneNumber(fullPhoneNumber);

      if (isRegistered) {
        setError(
          <>
            Phone number already registered.{" "}
            <a href="/login" className="text-orange-500 font-semibold underline hover:text-orange-600">
              Login here
            </a>.
          </>
        );
      } else {
        const otp = generateOTP();
        setGeneratedOtp(otp);
        setOtpSent(true);
        setError("");
        alert("OTP sent to your phone: " + otp); // Simulate OTP sent
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (enteredOtp === generatedOtp) {
        navigate("/register-option", { state: { phoneNumber } });
      } else {
        setError("Invalid OTP. Please try again.");
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResendOtp = () => {
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setEnteredOtp("");
    setError("");
    alert("New OTP sent: " + newOtp); // Simulate
  };

  const fakeCheckPhoneNumber = (number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(number === "+911234567890"); // Simulate only this number as registered
      }, 1000);
    });
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
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhoneNumber(value);
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
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
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
        </div>
      </div>
    </>
  );
}