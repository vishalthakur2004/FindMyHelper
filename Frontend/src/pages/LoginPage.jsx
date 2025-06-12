import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/userSlice";
import { userService } from "../services/userService";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const phoneNumber = `+91${data.phoneNumber}`;

      const result = await userService.login(phoneNumber, data.password);

      if (result.success) {
        dispatch(setUserInfo(result.data));
        if (result.data.user.role === "customer") {
          navigate("/customer-home");
        } else if (result.data.user.role === "worker") {
          navigate("/worker-home");
        } else {
          navigate("/");
        }
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Login</h2>

          <label className="block text-left mb-1 text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
            className="w-full p-3 mb-1 border rounded-xl"
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mb-2">{errors.phoneNumber.message}</p>
          )}

          <label className="block text-left mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "At least 6 characters",
              },
            })}
            className="w-full p-3 mb-3 border rounded-xl"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-orange-300" : "bg-orange-400 hover:bg-orange-500"
            } text-white py-3 rounded-xl text-lg`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center mt-2">Don't have an account? <a href="/check-phone-number" className="text-orange-500 hover:underline">Register Now</a></p>
        </form>
      </div>
    </>
  );
}

