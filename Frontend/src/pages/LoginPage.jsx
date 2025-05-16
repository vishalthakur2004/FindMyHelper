import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../features/userSlice";
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
      const modifiedData = { ...data, phoneNumber: `+91${data.phoneNumber}` };


      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, modifiedData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(setUserInfo(response.data));
        navigate("/home");
      } else {
        alert("Invalid credentials");
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
        </form>
      </div>
    </>
  );
}

