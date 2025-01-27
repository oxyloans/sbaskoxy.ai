import React from "react";
import { FaMapMarkerAlt, FaShoppingBag, FaUser } from "react-icons/fa";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import buyrice from "../assets/img/buyrice.png";
import { useNavigate, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirect = () => {
    navigate("/dashboard"); // Redirect to the dashboard page
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow p-2 sm:p-4 flex items-center justify-between">
      {/* Logo and "Buy Rice" Button */}
      <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
        {/* Logo */}
        <img
          src={AskOxyLogo}
          className="h-12 sm:h-16 w-auto object-contain cursor-pointer"
          alt="AskOxyLogo"
          onClick={handleRedirect}
        />
        {/* "Buy Rice" Button */}
        <button className="flex items-center space-x-2 sm:space-x-1 p-2 sm:p-1 bg-transparent">
          <img
            src={buyrice}
            onClick={() => navigate("/buyrice")}
            className="h-12 sm:h-16 w-auto object-contain"
            alt="BuyRice"
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-2 sm:mx-4">
        <input
          type="text"
          placeholder="Search for Rice bags"
          className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-full w-full sm:w-1/2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Right Section: Profile and Cart */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Profile Button */}
        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center space-x-1 text-sm sm:text-base px-3 py-2 rounded-full transition-all duration-200 ${
            isActive("/profile")
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          <FaUser className="text-lg sm:text-xl" />
          <span className="hidden sm:inline">Profile</span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => navigate("/mycart")}
          className={`flex items-center space-x-1 text-sm sm:text-base px-3 py-2 rounded-full transition-all duration-200 ${
            isActive("/mycart")
              ? "bg-green-100 text-green-600"
              : "text-gray-700 hover:text-green-500"
          }`}
        >
          <FaShoppingBag className="text-lg sm:text-xl" />
          <span className="hidden sm:inline">Cart</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
