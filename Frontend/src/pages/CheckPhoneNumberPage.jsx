import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { VALIDATION_PATTERNS } from "../constants";

const CheckPhoneNumberPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.verifyPhone({
        phoneNumber: data.phoneNumber,
      });

      if (response.data.exists) {
        // User exists, redirect to login
        showSuccess("Phone number found. Please log in.");
        navigate("/login", { state: { phoneNumber: data.phoneNumber } });
      } else {
        // New user, redirect to registration options
        showSuccess("New phone number. Please choose your registration type.");
        navigate("/register-option", {
          state: { phoneNumber: data.phoneNumber },
        });
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to verify phone number",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Enter your phone number to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: VALIDATION_PATTERNS.PHONE,
                  message: "Please enter a valid phone number",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CheckPhoneNumberPage;
