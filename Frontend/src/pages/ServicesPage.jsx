import React from "react";

const Services = () => {
  const servicesList = [
    {
      name: "Home Cleaning",
      description: "Professional cleaning services for your home, including deep cleaning, regular cleaning, and more.",
      imageUrl: "https://via.placeholder.com/400x300?text=Home+Cleaning",
    },
    {
      name: "Plumbing",
      description: "Expert plumbing services for repairs, installations, leak detection, and maintenance.",
      imageUrl: "https://via.placeholder.com/400x300?text=Plumbing",
    },
    {
      name: "Electrical Repairs",
      description: "Certified electricians available for any electrical issue, from wiring repairs to installations.",
      imageUrl: "https://via.placeholder.com/400x300?text=Electrical+Repairs",
    },
    {
      name: "Gardening",
      description: "Skilled gardeners for lawn care, tree trimming, planting, and garden maintenance.",
      imageUrl: "https://via.placeholder.com/400x300?text=Gardening",
    },
    {
      name: "Carpentry",
      description: "Custom carpentry services, including furniture repair, shelving, and woodwork installations.",
      imageUrl: "https://via.placeholder.com/400x300?text=Carpentry",
    },
    {
      name: "Handyman Services",
      description: "General repair and maintenance services for all types of minor home projects.",
      imageUrl: "https://via.placeholder.com/400x300?text=Handyman+Services",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-6">Our Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">{service.name}</h2>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <a
                  href="/book-now"
                  className="inline-block bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition"
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
