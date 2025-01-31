import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import buyrice from "../assets/img/buyrice.png";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount: propCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(propCartCount);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const searchTexts = [
    "Sonamasoori Rice",
    "Kolam Rice",
    "Brown Rice",
    "HMT Rice"
  ];

  // Animated scroll up effect for search placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSearchIndex((prev) => (prev + 1) % searchTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const count = localStorage.getItem("cartCount");
    if (count) {
      setCartCount(parseInt(count));
    }
  }, []);

  // Update local cartCount when prop changes
  useEffect(() => {
    setCartCount(propCartCount);
  }, [propCartCount]);

  const isActive = (path: string): boolean => location.pathname === path;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo and Buy Rice Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <img
              src={AskOxyLogo}
              className="h-8 w-auto sm:h-12 cursor-pointer transform hover:scale-105 transition-transform duration-200"
              alt="AskOxy"
              onClick={() => navigate("/dashboard")}
            />
            <img
              src={buyrice}
              className="h-8 w-auto sm:h-12 cursor-pointer transform hover:scale-105 transition-transform duration-200 hidden sm:block"
              alt="Buy Rice"
              onClick={() => navigate("/buyrice")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center px-4">
            {/* Search Bar */}
            <div className="max-w-2xl w-full relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full
                           text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           outline-none transition-all duration-200"
                  placeholder=" "
                />
                {/* Animated Placeholder */}
                {!searchValue && (
                  <div className="absolute left-4 top-0 h-full flex items-center pointer-events-none text-gray-400 overflow-hidden">
                    <span>Search for </span>
                    <div className="ml-1 h-6 overflow-hidden">
                      <div
                        className="transition-transform duration-500"
                        style={{
                          transform: `translateY(-${currentSearchIndex * 24}px)`
                        }}
                      >
                        {searchTexts.map((text, index) => (
                          <div key={index} className="h-6">
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  {searchValue && (
                    <button
                      onClick={() => setSearchValue("")}
                      className="p-1 hover:text-gray-600 text-gray-400"
                    >
                      <span className="text-xl">×</span>
                    </button>
                  )}
                  <FaSearch className="text-gray-400 ml-2" />
                </div>
              </div>

              {/* Search Suggestions */}
              {searchValue && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  {searchTexts.map((text, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => {
                        setSearchValue(text);
                      }}
                    >
                      <FaSearch className="text-gray-400 text-sm" />
                      <span>{text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Profile and Cart */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full
                       transition-all duration-200 ${
                         isActive("/profile")
                           ? "bg-blue-100 text-blue-600"
                           : "text-gray-700 hover:bg-gray-50"
                       }`}
            >
              <AiOutlineUser className="text-xl" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => navigate("/mycart")}
              className={`relative flex items-center space-x-1 px-3 py-2 rounded-full
                       transition-all duration-200 ${
                         isActive("/mycart")
                           ? "bg-green-100 text-green-600"
                           : "text-gray-700 hover:bg-gray-50"
                       }`}
            >
              <AiOutlineShoppingCart className="text-xl" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                              font-bold rounded-full w-5 h-5 flex items-center justify-center
                              animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } absolute top-16 left-0 right-0 bg-white shadow-lg sm:hidden`}
          >
            {/* Mobile Search */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearch}
                  className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full
                           text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Buy Rice Button in Mobile Menu */}
            <button
              onClick={() => {
                navigate("/buyrice");
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center py-3 hover:bg-gray-50 border-t border-gray-200"
            >
              <img
                src={buyrice}
                className="h-8 w-auto"
                alt="Buy Rice"
              />
            </button>

            {/* Mobile Navigation Links */}
            <div className="border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/profile");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50"
              >
                <AiOutlineUser className="text-xl" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate("/mycart");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 border-t border-gray-200"
              >
                <AiOutlineShoppingCart className="text-xl" />
                <span>Cart ({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;