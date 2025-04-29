import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function RegisterCustomer() {
  const { state } = useLocation();
  const phoneNumber = state?.phoneNumber;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onInitialSubmit = (data) => {
    setFormData({ ...data, phoneNumber });
    setShowPassword(true);
  };

  const onFinalSubmit = (data) => {
    const fullData = { ...formData, password: data.password };
    console.log("Sending to backend:", fullData);

    // TODO: Send data to backend here
    navigate("/"); // Redirect to home
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
                <p className="text-red-500 text-sm mb-3">{errors.fullName.message}</p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
              )}

              <label className="block text-left mb-1 text-sm font-medium">Address</label>
              <input
                {...register("address", { required: "Address is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mb-4">{errors.address.message}</p>
              )}
            </>
          )}

          {showPassword && (
            <>
              <label className="block text-left mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
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
