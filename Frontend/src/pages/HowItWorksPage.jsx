import React from "react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">How It Works</h1>

        <section>
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">💡 For Customers</h2>
          <p className="text-lg text-gray-700 mb-4">
            <strong>FindMyHelper</strong> makes it easy to connect with trusted, skilled professionals for any task — from home repairs to personal services. Here’s how you can get started:
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Sign Up & Browse</h3>
                <p className="text-gray-700">Sign up quickly with your phone number and explore our wide range of service categories.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Select Your Helper</h3>
                <p className="text-gray-700">Browse through verified professionals based on ratings, reviews, and availability, then choose the one that suits your needs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Confirm & Book</h3>
                <p className="text-gray-700">After choosing a helper, confirm the time and date. You'll receive an immediate booking confirmation.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Pay Securely</h3>
                <p className="text-gray-700">Pay securely through the app after the service is completed. We offer transparent pricing with no hidden charges.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Rate Your Experience</h3>
                <p className="text-gray-700">Once the service is complete, rate your experience and help others make informed decisions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🛠️ For Helpers</h2>
          <p className="text-lg text-gray-700 mb-4">
            Are you a skilled professional looking for more opportunities? Here's how you can get started with FindMyHelper:
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Sign Up & Create Profile</h3>
                <p className="text-gray-700">Register with your phone number and fill out your profile with your skills, experience, and availability.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Get Verified</h3>
                <p className="text-gray-700">Go through our verification process to ensure you're a trusted professional. This helps customers feel safe booking with you.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Start Receiving Bookings</h3>
                <p className="text-gray-700">Once verified, you'll start receiving service requests. You can choose the jobs that fit your schedule and expertise.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Complete the Service</h3>
                <p className="text-gray-700">Provide excellent service, communicate with your customer as needed, and complete the job to their satisfaction.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400 text-white flex items-center justify-center rounded-full">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-600">Get Paid & Build Your Reputation</h3>
                <p className="text-gray-700">After the service is completed, you'll receive payment through the platform. The customer can also rate and review your work, helping you build a strong reputation.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center">
          <p className="text-lg text-orange-600 font-semibold">FindMyHelper: Connecting You with the Right Help, Fast.</p>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
