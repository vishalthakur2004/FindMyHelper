import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { setUserInfo } from "../features/userSlice";
import { useDispatch } from "react-redux";

export default function RegisterCustomer() {
  const { state } = useLocation();
  const phoneNumber = state?.phoneNumber;
  const token = state?.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(null);

  if (!phoneNumber) {
    navigate("/");
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onInitialSubmit = (data) => {
    setFormData({ ...data, role : "customer", phoneNumber, token });
    setShowPassword(true);
  };

  const onFinalSubmit = async (data) => {
    const fullData = { ...formData, password: data.password };

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, fullData);
    if(response.status == 201){
      dispatch(setUserInfo(response.data.user));
      navigate("/home");
    }
    else{
      alert("Registration failed");
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

              <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-left mb-1 text-sm font-medium">House No. / Street</label>
                <input
                  {...register("address.street", { required: "Street address is required" })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter street address"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-sm">{errors.address.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-left mb-1 text-sm font-medium">City</label>
                <input
                  {...register("address.city", { required: "City is required" })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter your city"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-sm">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-left mb-1 text-sm font-medium">State</label>
                <input
                  {...register("address.state", { required: "State is required" })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter your state"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-sm">{errors.address.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-left mb-1 text-sm font-medium">Pincode</label>
                <input
                  {...register("address.pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[1-9][0-9]{5}$/,
                      message: "Invalid pincode format",
                    },
                  })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter your pincode"
                />
                {errors.address?.pincode && (
                  <p className="text-red-500 text-sm">{errors.address.pincode.message}</p>
                )}
              </div>
            </div>
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
