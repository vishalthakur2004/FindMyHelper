import { Link } from "react-router-dom";
import { Users, Shield, Star, Award } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const AboutUsPage = () => {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About ServiceConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're on a mission to connect customers with trusted local service
            providers, making it easier than ever to get things done.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-6">
              ServiceConnect was founded with a simple belief: everyone deserves
              access to reliable, high-quality services in their local
              community. We bridge the gap between skilled professionals and
              customers who need their expertise.
            </p>
            <p className="text-gray-600">
              Whether you're a homeowner looking for a plumber, a busy
              professional needing house cleaning, or a business owner seeking
              specialized services, we make it easy to find, book, and pay for
              exactly what you need.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Trust & Safety
                  </h3>
                  <p className="text-gray-600">
                    All service providers are verified and background-checked.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quality</h3>
                  <p className="text-gray-600">
                    We maintain high standards through ratings and reviews.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-gray-600">
                    Supporting local businesses and fostering connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
            <p className="text-gray-600">Verified Service Providers</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
            <p className="text-gray-600">Services Completed</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
            <p className="text-gray-600">Average Rating</p>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers and service providers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/check-phone-number">
              <Button size="lg">Find Services</Button>
            </Link>
            <Link to="/register-option">
              <Button size="lg" variant="outline">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
