import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function RegisterOption() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber } = location.state || {};

  if (!phoneNumber) {
    navigate("/"); // fallback if no phone number
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Register As</h2>
          <button
            onClick={() => navigate("/register-customer", { state: { phoneNumber } })}
            className="w-full mb-4 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl text-lg"
          >
            Customer
          </button>
          <button
            onClick={() => navigate("/register-worker", { state: { phoneNumber } })}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl text-lg"
          >
            Worker
          </button>
        </div>
      </div>
    </>
  );
}
