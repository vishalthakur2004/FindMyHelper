import React, { useState } from "react";
import { Button } from "./ui/button";

function JobPostForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceCategory: "",
    budget: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceCategories = [
    "plumber",
    "electrician",
    "carpenter",
    "painter",
    "mason",
    "ac-technician",
    "appliance-repair",
    "pest-control",
    "gardener",
    "cleaner",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.serviceCategory ||
      !formData.budget
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.budget) <= 0) {
      alert("Budget must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        budget: parseFloat(formData.budget),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Fix kitchen sink leak"
          maxLength="100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Category *
        </label>
        <select
          name="serviceCategory"
          value={formData.serviceCategory}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a service</option>
          {serviceCategories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() +
                category.slice(1).replace("-", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Describe the work needed in detail..."
          maxLength="500"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {formData.description.length}/500 characters
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget (₹) *
        </label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your budget"
          min="0"
          step="50"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Work Location
        </label>

        <div>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City"
          />
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="State"
          />
        </div>

        <div>
          <input
            type="text"
            name="address.pincode"
            value={formData.address.pincode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="PIN code"
            pattern="[0-9]{6}"
            maxLength="6"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}

export default JobPostForm;