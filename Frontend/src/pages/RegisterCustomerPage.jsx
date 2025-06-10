import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { setUserInfo } from "../features/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function RegisterCustomer() {
  const { state } = useLocation();
  const phoneNumber = state?.phoneNumber;
  const token = state?.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/");
    }
  }, []);

  const onInitialSubmit = (data) => {
    setFormData({ ...data, role: "customer", phoneNumber, token });
    setShowPassword(true);
  };

  const onFinalSubmit = async (data) => {
    try {
      const completeData = { ...formData, ...data };

      const formPayload = new FormData();
      for (const key in completeData) {
        if (key === "photo" && completeData[key]?.[0]) {
          formPayload.append(key, completeData[key][0]);
        } else if (key === "address") {
          for (const field in completeData.address) {
            formPayload.append(`address[${field}]`, completeData.address[field]);
          }
        } else {
          formPayload.append(key, completeData[key]);
        }
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.status === 201) {
        dispatch(setUserInfo(response.data));
        navigate("/customer-home");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <form
          onSubmit={handleSubmit(showPassword ? onFinalSubmit : onInitialSubmit)}
          className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Customer Registration</h2>

          <label className="block text-left mb-1 text-sm font-medium">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            disabled
            className="w-full p-3 mb-4 border rounded-xl bg-gray-100"
          />

          {!showPassword && (
            <>
              <label className="block text-left mb-1 text-sm font-medium">Full Name</label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mb-2">{errors.fullName.message}</p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/, message: "Invalid email format" },
                })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">Street</label>
              <input
                {...register("address.street", { required: "Street is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter street address"
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.address.street.message}
                </p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">City</label>
              <input
                {...register("address.city", { required: "City is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter city"
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.address.city.message}
                </p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">State</label>
              <input
                {...register("address.state", { required: "State is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter state"
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.address.state.message}
                </p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">Pincode</label>
              <input
                {...register("address.pincode", { required: "Pincode is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter pincode"
              />
              {errors.address?.pincode && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.address.pincode.message}
                </p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">
                Profile Photo <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <input
                type="file"
                {...register("photo")}
                className="w-full p-2 mb-4 border rounded-xl"
                accept="image/*"
              />
            </>
          )}

          {showPassword && (
            <>
              <label className="block text-left mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                className="w-full p-3 mb-3 border rounded-xl"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl text-lg"
          >
            {showPassword ? "Complete Registration" : "Next"}
          </button>
        </form>
      </div>
    </>
  );
}
