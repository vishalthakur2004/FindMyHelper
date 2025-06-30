import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { JOB_CATEGORIES } from "../constants";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: Users,
      title: "Verified Professionals",
      description:
        "All service providers are background-checked and verified for your safety.",
    },
    {
      icon: Star,
      title: "Quality Guarantee",
      description:
        "Read reviews and ratings from real customers to make informed decisions.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description:
        "Safe and secure payment processing with money-back guarantee.",
    },
  ];

  const popularServices = JOB_CATEGORIES.slice(0, 8);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content:
        "Found an amazing cleaner through this platform. Professional, reliable, and affordable!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Handyman",
      content:
        "Great platform for finding consistent work. The booking system is so easy to use.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Customer",
      content:
        "Excellent service! The plumber fixed my issue quickly and the price was fair.",
      rating: 5,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results or services page
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                ServiceConnect
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                to="/how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How It Works
              </Link>
              <Link
                to="/services"
                className="text-gray-600 hover:text-gray-900"
              >
                Services
              </Link>
              <Link
                to="/about-us"
                className="text-gray-600 hover:text-gray-900"
              >
                About
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/check-phone-number">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Local Services
              <span className="text-blue-600 block">Near You</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with trusted professionals for all your home and personal
              service needs. From cleaning to repairs, we've got you covered.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button type="submit" size="lg">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Verified Professionals
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Instant Booking
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Secure Payments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-gray-600">
              Choose from our most requested services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularServices.map((service) => (
              <Link
                key={service}
                to={`/services?category=${encodeURIComponent(service)}`}
                className="group p-4 text-center rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-blue-600 font-semibold text-lg">
                    {service.charAt(0)}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {service}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600">
              Experience the difference with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose a Service
              </h3>
              <p className="text-gray-600">
                Browse our categories and find the service you need
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Book & Pay
              </h3>
              <p className="text-gray-600">
                Select your preferred provider and schedule a time
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Relax & Enjoy
              </h3>
              <p className="text-gray-600">
                Sit back while our professionals take care of everything
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600">
              Real reviews from satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of satisfied customers and service providers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-phone-number">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Find Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/register-option">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">
                ServiceConnect
              </h3>
              <p className="text-gray-400">
                Connecting you with trusted local service providers for all your
                needs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/services" className="hover:text-white">
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="hover:text-white">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/register-option" className="hover:text-white">
                    Join as Provider
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ServiceConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
