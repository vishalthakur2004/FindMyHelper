import { useLocation, useNavigate } from "react-router-dom";
import { User, Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const RegistrationOptionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const handleRoleSelection = (role) => {
    if (role === "customer") {
      navigate("/register-customer", { state: { phoneNumber } });
    } else {
      navigate("/register-worker", { state: { phoneNumber } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join ServiceConnect
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to use our platform
          </p>
          {phoneNumber && (
            <p className="text-sm text-gray-500 mt-2">Phone: {phoneNumber}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Option */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                I'm a Customer
              </h3>
              <p className="text-gray-600 mb-6">
                I need to hire professionals for various services
              </p>

              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• Book trusted professionals</li>
                <li>• Compare prices and reviews</li>
                <li>• Secure payment processing</li>
                <li>• 24/7 customer support</li>
              </ul>

              <Button
                onClick={() => handleRoleSelection("customer")}
                className="w-full"
                variant="outline"
              >
                Continue as Customer
              </Button>
            </div>
          </div>

          {/* Worker Option */}
          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                I'm a Service Provider
              </h3>
              <p className="text-gray-600 mb-6">
                I want to offer my services and grow my business
              </p>

              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• Find new customers</li>
                <li>• Manage bookings easily</li>
                <li>• Get paid securely</li>
                <li>• Build your reputation</li>
              </ul>

              <Button
                onClick={() => handleRoleSelection("worker")}
                className="w-full"
                style={{ backgroundColor: "#10B981" }}
              >
                Continue as Provider
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/check-phone-number")}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to phone verification
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login", { state: { phoneNumber } })}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationOptionsPage;
