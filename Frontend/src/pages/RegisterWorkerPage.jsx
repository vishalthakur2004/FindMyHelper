import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function RegisterWorker() {
  const { state } = useLocation();
  const phoneNumber = state?.phoneNumber;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availabilityTimes",
  });

  useEffect(() => {
    // Add one availability field by default
    if (!showPassword && fields.length === 0) {
      append({ day: "", startTime: "", endTime: "" });
    }
  }, [showPassword]);

  const onInitialSubmit = (data) => {
    setFormData({ ...data, phoneNumber });
    setShowPassword(true);
  };

  const onFinalSubmit = async (data) => {
    const completeData = { ...formData, ...data };

    const formPayload = new FormData();
    for (const key in completeData) {
      if (key === "photo" && completeData[key]?.[0]) {
        formPayload.append(key, completeData[key][0]);
      } else if (key === "availabilityTimes") {
        formPayload.append(key, JSON.stringify(completeData[key]));
      } else {
        formPayload.append(key, completeData[key]);
      }
    }

    console.log("Sending to backend:", completeData);

    try {
      const response = await fetch("address", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Worker Registration</h2>

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
              {errors.fullName && <p className="text-red-500 text-sm mb-2">{errors.fullName.message}</p>}

              <label className="block text-left mb-1 text-sm font-medium">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

              <label className="block text-left mb-1 text-sm font-medium">Profession</label>
              <select
                {...register("profession", { required: "Profession is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
              >
                <option value="">Select Profession</option>

                {/* Profession options (truncated for brevity) */}
                <optgroup label="Home Services">
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painter">Painter</option>
                  <option value="Mason">Mason</option>
                  <option value="AC Technician">AC Technician</option>
                  <option value="Appliance Repair Technician">Appliance Repair Technician</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Pest Control Specialist">Pest Control Specialist</option>
                  <option value="Roofer">Roofer</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Home Cleaner">Home Cleaner</option>
                  <option value="Sofa Cleaner">Sofa Cleaner</option>
                  <option value="Glass Cleaner">Glass Cleaner</option>
                </optgroup>
                {/* Add the remaining categories here as needed */}
              </select>
              {errors.profession && <p className="text-red-500 text-sm mb-2">{errors.profession.message}</p>}

              <label className="block text-left mb-1 text-sm font-medium">Address</label>
              <input
                {...register("address", { required: "Address is required" })}
                className="w-full p-3 mb-1 border rounded-xl"
                placeholder="Enter your address"
              />
              {errors.address && <p className="text-red-500 text-sm mb-2">{errors.address.message}</p>}

              <label className="block text-left mb-1 text-sm font-medium">Availability Times</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row gap-2 mb-2">
                  <select
                    {...register(`availabilityTimes.${index}.day`, { required: "Day is required" })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Day</option>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    {...register(`availabilityTimes.${index}.startTime`, { required: "Start time is required" })}
                    className="w-full p-2 border rounded-md"
                  />

                  <input
                    type="time"
                    {...register(`availabilityTimes.${index}.endTime`, { required: "End time is required" })}
                    className="w-full p-2 border rounded-md"
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ day: "", startTime: "", endTime: "" })}
                className="mb-3 text-sm text-orange-600 underline"
              >
                + Add Availability
              </button>

              <label className="block text-left mb-1 text-sm font-medium">Profile Photo</label>
              <input
                type="file"
                {...register("photo", { required: "Photo is required" })}
                className="w-full p-2 mb-4 border rounded-xl"
                accept="image/*"
              />
              {errors.photo && <p className="text-red-500 text-sm mb-2">{errors.photo.message}</p>}
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
              {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}
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
