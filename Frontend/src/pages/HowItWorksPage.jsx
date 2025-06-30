import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  CreditCard,
  CheckCircle,
  Briefcase,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const HowItWorksPage = () => {
  const customerSteps = [
    {
      icon: Search,
      title: "Find Services",
      description:
        "Browse categories or search for the specific service you need. View profiles, ratings, and reviews.",
    },
    {
      icon: Calendar,
      title: "Book & Schedule",
      description:
        "Choose your preferred provider, select a convenient time, and confirm your booking.",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description:
        "Pay securely through our platform. Your money is protected until the job is complete.",
    },
    {
      icon: CheckCircle,
      title: "Service Complete",
      description:
        "Get quality service from verified professionals. Rate and review your experience.",
    },
  ];

  const providerSteps = [
    {
      icon: Briefcase,
      title: "Create Profile",
      description:
        "Set up your professional profile with your skills, experience, and service areas.",
    },
    {
      icon: Search,
      title: "Find Jobs",
      description:
        "Browse available jobs in your area and apply for ones that match your expertise.",
    },
    {
      icon: Calendar,
      title: "Get Booked",
      description:
        "Accept bookings from customers and manage your schedule through our platform.",
    },
    {
      icon: Star,
      title: "Build Reputation",
      description:
        "Deliver quality service, earn positive reviews, and grow your business.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ServiceConnect
            </Link>
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
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How ServiceConnect Works
          </h1>
          <p className="text-xl text-gray-600">
            Simple, secure, and reliable - connecting customers with trusted
            professionals
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For Customers
            </h2>
            <p className="text-gray-600">
              Get quality services in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customerSteps.map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/check-phone-number">
              <Button size="lg">Start Booking Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Service Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              For Service Providers
            </h2>
            <p className="text-gray-600">
              Grow your business in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {providerSteps.map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="w-8 h-8 bg-green-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/register-option">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ServiceConnect?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                For Customers
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Verified and background-checked professionals
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Transparent pricing with no hidden fees
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Secure payment processing
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  24/7 customer support
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Satisfaction guarantee
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                For Service Providers
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Access to thousands of potential customers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Easy scheduling and booking management
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Fast and secure payments
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Build your online reputation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  Marketing and promotional tools
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join the ServiceConnect community today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-phone-number">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Find Services
              </Button>
            </Link>
            <Link to="/register-option">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Offer Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
