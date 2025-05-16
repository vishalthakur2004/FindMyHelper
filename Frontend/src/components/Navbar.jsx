import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = (path) =>
    currentPath === path
      ? "text-orange-600 font-semibold"
      : "hover:text-orange-500";

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <Link to="/" className="text-2xl font-bold text-orange-600">
        FindMyHelper
      </Link>
      <nav className="space-x-6">
        <Link to="/home" className={linkClass("/home")}>
          Home
        </Link>
        <Link to="/about-us" className={linkClass("/about-us")}>
          About Us
        </Link>
        <Link to="/how-it-works" className={linkClass("/how-it-works")}>
          How It Works
        </Link>
        <Link to="/services" className={linkClass("/services")}>
          Services
        </Link>
        <Link to="/contact" className={linkClass("/contact")}>
          Contact
        </Link>
      </nav>
    </header>
  );
}