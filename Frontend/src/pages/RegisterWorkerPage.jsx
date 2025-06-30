import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Briefcase, ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { registerUser } from "../store/slices/userSlice";
import { useToast } from "../hooks/useToast";
import { VALIDATION_PATTERNS, JOB_CATEGORIES } from "../constants";

const RegisterWorkerPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useToast();

  const phoneNumber = location.state?.phoneNumber;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: phoneNumber || "",
    },
  });

  const password = watch("password");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data) => {
    if (skills.length === 0) {
      showError("Please add at least one skill");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        registerUser({
          ...data,
          role: "worker",
          skills,
        }),
      ).unwrap();

      showSuccess("Registration successful! Welcome to ServiceConnect!");
      navigate("/dashboard");
    } catch (error) {
      showError(error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Provider Account
          </h1>
          <p className="text-gray-600">
            Join as a service provider to grow your business
          </p>
          {phoneNumber && (
            <p className="text-sm text-gray-500 mt-2">Phone: {phoneNumber}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: VALIDATION_PATTERNS.EMAIL,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

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

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Service Area
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter your service area"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("address", {
                required: "Service area is required",
              })}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Primary Service Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("category", {
                required: "Please select a category",
              })}
            >
              <option value="">Select a category</option>
              {JOB_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Expertise
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {skills.length === 0 && (
              <p className="text-sm text-gray-500">
                Add skills to showcase your expertise
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Years of Experience
            </label>
            <select
              id="experience"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("experience", {
                required: "Please select your experience level",
              })}
            >
              <option value="">Select experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-600">
                {errors.experience.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: VALIDATION_PATTERNS.PASSWORD,
                    message:
                      "Password must be at least 8 characters with uppercase, lowercase, and number",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register("agreeTerms", {
                required: "You must agree to the terms and conditions",
              })}
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to the{" "}
              <a
                href="/terms"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.agreeTerms.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{ backgroundColor: "#10B981" }}
          >
            {loading ? "Creating Account..." : "Create Provider Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              navigate("/register-option", { state: { phoneNumber } })
            }
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to registration options
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login", { state: { phoneNumber } })}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterWorkerPage;
