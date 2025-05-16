import Navbar from "../components/Navbar.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Wrench, Wallet, ClipboardList, Users, CheckCircle } from "lucide-react";
import photo from "../assets/hero.png";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen font-sans text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-20">
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-5xl font-bold mb-4">Find Trusted Helpers Near You</h1>
          <p className="text-lg text-gray-700 mb-6">
            Need help with daily tasks, repairs, or services? FindMyHelper connects you with verified local helpers — fast and hassle-free.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link to="/check-phone-number">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 text-lg rounded-full shadow-md">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-100 px-6 py-3 text-lg rounded-full shadow-md">
                Login
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">Thousands of satisfied customers ⭐</p>
        </div>
        <img
          src={photo} 
          alt="Helper illustration"
          className="w-full max-w-md hidden md:block"
        />
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h2 className="text-4xl font-bold mb-6 text-orange-600">
          Simplifying Local Services for Everyone
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          FindMyHelper bridges the gap between local workers and customers who need reliable help. Whether it's home repairs, cleaning, tutoring, or event support — we make finding trusted help easier than ever.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition duration-300">
            <CardContent className="p-6 text-center">
              <Wrench className="mx-auto text-orange-500 mb-4" size={32} />
              <h4 className="text-2xl font-semibold mb-3">Quick & Easy Hiring</h4>
              <p className="text-gray-500 text-base">Post your job or browse profiles and hire the right helper in minutes.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition duration-300">
            <CardContent className="p-6 text-center">
              <Wallet className="mx-auto text-orange-500 mb-4" size={32} />
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
            <ClipboardList className="mx-auto text-orange-500 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">1. Post a Job</h4>
            <p className="text-gray-500">Describe the help you need — it's free and easy.</p>
          </div>
          <div>
            <Users className="mx-auto text-orange-500 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">2. Connect with Helpers</h4>
            <p className="text-gray-500">Receive offers from nearby trusted helpers.</p>
          </div>
          <div>
            <CheckCircle className="mx-auto text-orange-500 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">3. Hire and Get Work Done</h4>
            <p className="text-gray-500">Choose the best fit and get your job completed stress-free.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-3">"FindMyHelper made it so easy to find someone to fix my kitchen tap within a few hours!"</p>
            <span className="text-sm font-semibold text-orange-600">- Ramesh K., Delhi</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-3">"Great platform! I found a reliable tutor for my daughter quickly."</p>
            <span className="text-sm font-semibold text-orange-600">- Neha S., Mumbai</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-inner">
        <h3 className="text-4xl font-bold mb-4">Start Finding Trusted Helpers Today!</h3>
        <p className="mb-6 text-lg">Join thousands of users getting work done on time with FindMyHelper.</p>
        <Link to="/check-phone-number">
          <Button className="bg-white text-orange-500 hover:text-orange-600 font-bold px-8 py-3 text-lg rounded-full shadow-lg transition-all">
            Find Helpers Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
