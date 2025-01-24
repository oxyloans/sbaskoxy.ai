import React from "react";
import { FaMapMarkerAlt, FaShoppingBag, FaUser } from "react-icons/fa";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import { useNavigate } from "react-router-dom";
import buyrice from "../assets/img/buyrice.png";

const Header = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/dashboard"); // Redirect to the login page
  };



  return (
    <header className="bg-white shadow p-2 sm:p-4 flex items-center justify-between">
      {/* Logo and "Buy Rice" Button */}
      <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
        {/* Logo */}
        <img
          src={AskOxyLogo}
          className="h-12 sm:h-16 w-auto object-contain cursor-pointer" // Responsive height, maintains aspect ratio
          alt="AskOxyLogo"
          onClick={handleRedirect}
        />
        {/* "Buy Rice" Button */}
        <button
          className="flex items-center space-x-2 sm:space-x-1 p-2 sm:p-1 bg-transparent" // Compact padding for mobile
        >
          <img
            src={buyrice}
            className="h-12 sm:h-16 w-auto object-contain" // Responsive height, maintains aspect ratio
            alt="BuyRice"
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-2 sm:mx-4">
        <input
          type="text"
          placeholder="Search for Rice bags"
          className="px-2 sm:px-4 py-1 sm:py-2 border rounded-full w-full sm:w-1/2 text-sm sm:text-base"
        />
      </div>

      {/* Right Section: Profile and Cart */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-blue-500 transition-colors flex items-center space-x-1 text-sm sm:text-base"
        >
          <FaUser className="text-lg sm:text-xl" />
          <span className="hidden sm:inline">Profile</span>
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="text-gray-700 hover:text-green-500 transition-colors flex items-center space-x-1 text-sm sm:text-base"
        >
          <FaShoppingBag className="text-lg sm:text-xl" />
          <span className="hidden sm:inline">Cart</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
