import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("Error sending message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">Contact Us</h1>

        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">
              Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <p className="text-gray-700 font-medium">Email: support@findmyhelper.com</p>
            <p className="text-gray-700 font-medium">Phone: (123) 456-7890</p>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-gray-100"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-gray-100"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-gray-100"
                  placeholder="Your message"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg"
              >
                Send Message
              </button>

              {status && (
                <div
                  className={`mt-4 text-center ${
                    status.includes("success") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
