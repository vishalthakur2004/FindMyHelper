import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { JOB_CATEGORIES } from "../constants";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600">
            Professional services for every need
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {JOB_CATEGORIES.map((category) => (
            <Card
              key={category}
              className="p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {category.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional {category.toLowerCase()} services
              </p>
              <Link
                to={`/find-workers?category=${encodeURIComponent(category)}`}
              >
                <Button size="sm" variant="outline">
                  Find Providers
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
