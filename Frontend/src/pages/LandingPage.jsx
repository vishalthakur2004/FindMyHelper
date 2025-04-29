import Navbar from "../components/Navbar.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom"; // assuming you're using React Router

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen font-sans text-gray-900">
      
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Find Trusted Helpers Near You</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          Need help with daily tasks, repairs, or services? FindMyHelper connects you with verified local helpers you can trust — fast and hassle-free.
        </p>
        <div className="flex gap-6">
          {/* Button to Register as Customer */}
          <Link to="/check-phone-number">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg">
              Register Now
            </Button>
          </Link>

          {/* Button to Register as Worker */}
          <Link to="/login">
            <Button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 px-6 py-3 text-lg">
              Login
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">Thousands of satisfied customers ⭐</p>
      </section>

      {/* About FindMyHelper Section */}
      <section className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h2 className="text-4xl font-bold mb-6 text-orange-600">
          Simplifying Local Services for Everyone
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          FindMyHelper was built to bridge the gap between local workers and customers who need reliable help. Whether it's home repairs, cleaning, tutoring, or event support — we make finding trusted help easier than ever.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition duration-300">
            <CardContent className="p-6 text-center">
              <h4 className="text-2xl font-semibold mb-3">Quick & Easy Hiring</h4>
              <p className="text-gray-500 text-base">Post your job or browse profiles and hire the right helper in minutes.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition duration-300">
            <CardContent className="p-6 text-center">
              <h4 className="text-2xl font-semibold mb-3">Affordable & Transparent</h4>
              <p className="text-gray-500 text-base">Get quality services at fair prices with no hidden charges.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-orange-600">How FindMyHelper Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="text-xl font-semibold mb-2">1. Post a Job</h4>
            <p className="text-gray-500">Describe the help you need — it's free and easy.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">2. Connect with Helpers</h4>
            <p className="text-gray-500">Receive offers from nearby trusted helpers.</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">3. Hire and Get Work Done</h4>
            <p className="text-gray-500">Choose the best fit and get your job completed stress-free.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
        <h3 className="text-3xl font-bold mb-4">
          Start Finding Trusted Helpers Today!
        </h3>
        <Link to="/check-phone-number">
          <Button className="bg-white text-orange-500 hover:text-orange-600 font-bold px-8 py-3 text-lg">
            Find Helpers Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
