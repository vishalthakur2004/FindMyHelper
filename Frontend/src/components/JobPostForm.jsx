import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { createJob } from "../features/jobSlice";

function JobPostForm({ onSuccess, onCancel, editingJob = null }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.jobs);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: editingJob || {
      title: "",
      description: "",
      serviceCategory: "",
      budget: "",
      location: {
        address: "",
        coordinates: { latitude: "", longitude: "" },
      },
      requirements: [],
      urgency: "medium",
      duration: "",
      notes: "",
    },
  });

  const watchBudget = watch("budget");
  const watchServiceCategory = watch("serviceCategory");
  const [requirements, setRequirements] = useState(
    editingJob?.requirements || [],
  );
  const [newRequirement, setNewRequirement] = useState("");

  const serviceCategories = [
    { value: "", label: "Select Service Category" },
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical Work" },
    { value: "cleaning", label: "Cleaning Services" },
    { value: "painting", label: "Painting & Decoration" },
    { value: "carpentry", label: "Carpentry & Woodwork" },
    { value: "gardening", label: "Gardening & Landscaping" },
    { value: "moving", label: "Moving & Packing" },
    { value: "appliance-repair", label: "Appliance Repair" },
    { value: "handyman", label: "General Handyman" },
    { value: "construction", label: "Construction Work" },
    { value: "roofing", label: "Roofing Services" },
    { value: "pest-control", label: "Pest Control" },
    { value: "security", label: "Security Services" },
  ];

  const urgencyOptions = [
    { value: "low", label: "Low - Flexible timing", color: "green" },
    { value: "medium", label: "Medium - Within a week", color: "yellow" },
    { value: "urgent", label: "Urgent - ASAP", color: "red" },
  ];

  const handleAddRequirement = () => {
    if (
      newRequirement.trim() &&
      !requirements.includes(newRequirement.trim())
    ) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      setRequirements(updatedRequirements);
      setValue("requirements", updatedRequirements);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (requirement) => {
    const updatedRequirements = requirements.filter(
      (req) => req !== requirement,
    );
    setRequirements(updatedRequirements);
    setValue("requirements", updatedRequirements);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const jobData = {
        ...data,
        requirements,
        budget: parseFloat(data.budget),
        location: {
          address: data.location.address,
          coordinates: {
            latitude: parseFloat(data.location.coordinates.latitude) || 0,
            longitude: parseFloat(data.location.coordinates.longitude) || 0,
          },
        },
      };

      const result = await dispatch(createJob(jobData));

      if (result.type === "jobs/createJob/fulfilled") {
        reset();
        setRequirements([]);
        if (onSuccess) onSuccess(result.payload);
      } else {
        throw new Error(result.payload || "Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBudgetEstimate = (category, budget) => {
    const estimates = {
      plumbing: { min: 500, max: 5000, unit: "per service" },
      electrical: { min: 300, max: 3000, unit: "per service" },
      cleaning: { min: 200, max: 1500, unit: "per session" },
      painting: { min: 20, max: 80, unit: "per sq ft" },
      carpentry: { min: 800, max: 8000, unit: "per project" },
      gardening: { min: 300, max: 2000, unit: "per session" },
      moving: { min: 1000, max: 10000, unit: "per move" },
      "appliance-repair": { min: 400, max: 3000, unit: "per repair" },
      handyman: { min: 300, max: 1500, unit: "per hour" },
    };

    const estimate = estimates[category];
    if (!estimate) return null;

    const budgetNum = parseFloat(budget);
    let suggestion = "";

    if (budgetNum && budgetNum < estimate.min) {
      suggestion = `Consider increasing budget. Typical range: ₹${estimate.min}-${estimate.max} ${estimate.unit}`;
    } else if (budgetNum && budgetNum > estimate.max) {
      suggestion = `Your budget is generous! Typical range: ₹${estimate.min}-${estimate.max} ${estimate.unit}`;
    } else if (estimate) {
      suggestion = `Good budget range. Typical: ₹${estimate.min}-${estimate.max} ${estimate.unit}`;
    }

    return suggestion;
  };

  return (
    <Card className="job-post-form-card w-full max-w-4xl mx-auto">
      <div className="form-header p-6 border-b border-gray-200">
        <h2 className="form-title text-2xl font-bold text-gray-900 mb-2">
          {editingJob ? "Edit Job Post" : "Post a New Job"}
        </h2>
        <p className="form-subtitle text-gray-600">
          Provide detailed information to attract the right workers for your
          project
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="job-form p-6">
        <div className="form-sections space-y-8">
          {/* Basic Information */}
          <section className="basic-info-section">
            <h3 className="section-title text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>

            <div className="section-fields space-y-4">
              <div className="title-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Job title is required",
                    minLength: {
                      value: 10,
                      message: "Title must be at least 10 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Title must be less than 100 characters",
                    },
                  })}
                  placeholder="e.g., Fix kitchen sink leak, Paint living room walls"
                  className={`field-input w-full p-3 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.title && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="category-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Service Category *
                </label>
                <select
                  {...register("serviceCategory", {
                    required: "Please select a service category",
                  })}
                  className={`field-select w-full p-3 border rounded-md ${errors.serviceCategory ? "border-red-500" : "border-gray-300"}`}
                >
                  {serviceCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.serviceCategory && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.serviceCategory.message}
                  </p>
                )}
              </div>

              <div className="description-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  {...register("description", {
                    required: "Job description is required",
                    minLength: {
                      value: 50,
                      message: "Description must be at least 50 characters",
                    },
                  })}
                  placeholder="Describe the work that needs to be done, include specific requirements, timeline, and any important details..."
                  className={`field-textarea w-full p-3 border rounded-md resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  rows={5}
                />
                {errors.description && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
                <p className="field-hint text-xs text-gray-500 mt-1">
                  Be specific about what you need. Good descriptions get better
                  responses.
                </p>
              </div>
            </div>
          </section>

          {/* Budget and Timeline */}
          <section className="budget-timeline-section">
            <h3 className="section-title text-lg font-semibold text-gray-900 mb-4">
              Budget & Timeline
            </h3>

            <div className="section-fields grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="budget-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Budget (₹) *
                </label>
                <input
                  type="number"
                  {...register("budget", {
                    required: "Budget is required",
                    min: { value: 100, message: "Minimum budget is ₹100" },
                    max: {
                      value: 100000,
                      message: "Maximum budget is ₹1,00,000",
                    },
                  })}
                  placeholder="Enter your budget"
                  className={`field-input w-full p-3 border rounded-md ${errors.budget ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.budget && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.budget.message}
                  </p>
                )}
                {watchServiceCategory && watchBudget && (
                  <p className="budget-estimate text-xs text-blue-600 mt-1">
                    💡 {getBudgetEstimate(watchServiceCategory, watchBudget)}
                  </p>
                )}
              </div>

              <div className="urgency-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  {...register("urgency", {
                    required: "Please select urgency level",
                  })}
                  className={`field-select w-full p-3 border rounded-md ${errors.urgency ? "border-red-500" : "border-gray-300"}`}
                >
                  {urgencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.urgency && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.urgency.message}
                  </p>
                )}
              </div>

              <div className="duration-field md:col-span-2">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  {...register("duration")}
                  placeholder="e.g., 2 hours, Half day, 2-3 days"
                  className="field-input w-full p-3 border border-gray-300 rounded-md"
                />
                <p className="field-hint text-xs text-gray-500 mt-1">
                  Help workers understand the scope of work
                </p>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="location-section">
            <h3 className="section-title text-lg font-semibold text-gray-900 mb-4">
              Location Details
            </h3>

            <div className="section-fields space-y-4">
              <div className="address-field">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  {...register("location.address", {
                    required: "Address is required",
                  })}
                  placeholder="Enter your complete address"
                  className={`field-input w-full p-3 border rounded-md ${errors.location?.address ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.location?.address && (
                  <p className="field-error text-red-500 text-sm mt-1">
                    {errors.location.address.message}
                  </p>
                )}
              </div>

              <div className="coordinates-fields grid grid-cols-2 gap-4">
                <div className="latitude-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("location.coordinates.latitude")}
                    placeholder="e.g., 28.6139"
                    className="field-input w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="longitude-field">
                  <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("location.coordinates.longitude")}
                    placeholder="e.g., 77.2090"
                    className="field-input w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Requirements and Skills */}
          <section className="requirements-section">
            <h3 className="section-title text-lg font-semibold text-gray-900 mb-4">
              Skills & Requirements
            </h3>

            <div className="section-fields space-y-4">
              <div className="requirements-input">
                <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <div className="add-requirement-container flex gap-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="e.g., Licensed electrician, 5+ years experience"
                    className="requirement-input flex-1 p-3 border border-gray-300 rounded-md"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddRequirement())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleAddRequirement}
                    disabled={!newRequirement.trim()}
                    className="add-requirement-button bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
                <p className="field-hint text-xs text-gray-500 mt-1">
                  Add specific skills or qualifications you're looking for
                </p>
              </div>

              {requirements.length > 0 && (
                <div className="requirements-list">
                  <p className="requirements-label text-sm font-medium text-gray-700 mb-2">
                    Added Requirements:
                  </p>
                  <div className="requirements-tags flex flex-wrap gap-2">
                    {requirements.map((req, index) => (
                      <span
                        key={index}
                        className="requirement-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(req)}
                          className="remove-requirement text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Additional Notes */}
          <section className="notes-section">
            <h3 className="section-title text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>

            <div className="notes-field">
              <label className="field-label block text-sm font-medium text-gray-700 mb-1">
                Special Instructions or Notes
              </label>
              <textarea
                {...register("notes")}
                placeholder="Any additional information, special requirements, or instructions for workers..."
                className="field-textarea w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
              />
              <p className="field-hint text-xs text-gray-500 mt-1">
                Include parking information, access details, or any other
                relevant information
              </p>
            </div>
          </section>
        </div>

        {/* Form Actions */}
        <div className="form-actions flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting || loading.creating}
            className="submit-job bg-blue-600 hover:bg-blue-700 text-white flex-1 py-3"
          >
            {isSubmitting || loading.creating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {editingJob ? "Updating..." : "Publishing..."}
              </>
            ) : editingJob ? (
              "Update Job Post"
            ) : (
              "Publish Job Post"
            )}
          </Button>

          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="cancel-job py-3"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

export default JobPostForm;
