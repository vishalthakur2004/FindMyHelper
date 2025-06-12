import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { createBooking } from "../features/bookingSlice";

function BookingForm({ worker, onSubmit, onCancel }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.bookings);

  const [formData, setFormData] = useState({
    workerId: worker._id,
    serviceCategory: worker.serviceCategories?.[0] || "",
    scheduledDate: "",
    scheduledTime: "",
    amount: "",
    paymentMethod: "cash",
    description: "",
    urgent: false,
  });

  const isSubmitting = loading.creating;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scheduledDate || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(
      formData.scheduledDate + "T" + formData.scheduledTime,
    );

    if (selectedDate <= currentDate) {
      alert("Please select a future date and time");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    try {
      const bookingData = {
        ...formData,
        amount: parseFloat(formData.amount),
        scheduledDate: selectedDate.toISOString(),
      };

      const result = await dispatch(createBooking(bookingData));

      if (createBooking.fulfilled.match(result)) {
        if (onSubmit) {
          onSubmit(result.payload);
        }
      } else {
        alert(result.payload || "Failed to create booking request");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking request");
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Book {worker.fullName}
        </h3>
        <p className="text-sm text-gray-600">
          {worker.serviceCategories?.join(", ")} • ⭐ {worker.rating || "New"}
          {worker.rating && `(${worker.totalReviews || 0} reviews)`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type *
          </label>
          <select
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a service</option>
            {worker.serviceCategories?.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              min={getTomorrowDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount to pay"
            min="0"
            step="50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash on Service</option>
            <option value="online">Online Payment</option>
            <option value="upi">UPI</option>
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
            placeholder="Describe the work needed..."
            maxLength="500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="urgent"
            checked={formData.urgent}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">
            This is urgent (within 24 hours)
          </label>
        </div>

        {error.creating && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error.creating}
          </div>
        )}

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
            {isSubmitting ? "Booking..." : "Book Service"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default BookingForm;