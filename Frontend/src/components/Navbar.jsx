import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <Link to="/" className="text-2xl font-bold text-orange-600">
        FindMyHelper
      </Link>
      <nav className="space-x-6">
        <Link to="/about-us" className="hover:text-orange-500">
          About Us
        </Link>
        <Link to="/how-it-works" className="hover:text-orange-500">
          How It Works
        </Link>
        <Link to="/services" className="hover:text-orange-500">
          Services
        </Link>
        <Link to="/contact" className="hover:text-orange-500">
          Contact
        </Link>
      </nav>
    </header>
  );
}