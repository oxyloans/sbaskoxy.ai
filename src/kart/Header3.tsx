import React, { useEffect, useState } from "react";
import { 
  AiOutlineShoppingCart, 
  AiOutlineUser
} from "react-icons/ai";
import { 
  FaSearch, 
  FaTimes,
  FaUserCircle,
  FaShoppingCart
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount: propCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(propCartCount);
  const [searchValue, setSearchValue] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeButton, setActiveButton] = useState<'profile' | 'cart' | null>(null);

  const searchTexts = [
    "Sonamasoori Rice",
    "Kolam Rice",
    "Brown Rice",
    "HMT Rice"
  ];

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

  useEffect(() => {
    setCartCount(propCartCount);
  }, [propCartCount]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const renderSearchBar = () => (
    <div className="relative w-full group">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full 
          text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          outline-none transition-all duration-300 
          hover:border-blue-400 hover:shadow-md 
          group-focus-within:border-blue-500"
        placeholder=" "
      />
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
            className="p-1 text-gray-400 
            hover:text-red-500 hover:scale-110 transition-all duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
        <FaSearch className="text-gray-400 ml-2 
        group-focus-within:text-blue-500 
        hover:text-blue-500 hover:scale-110 transition-all duration-200" />
      </div>

      {(isFocused || searchValue) && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 
        animate-dropdown">
          {searchTexts
            .filter(text => 
              text.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((text, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left 
                hover:bg-blue-50 flex items-center space-x-2 
                transition-colors duration-200 hover:text-blue-600"
                onClick={() => {
                  setSearchValue(text);
                  setIsFocused(false);
                }}
              >
                <FaSearch className="text-gray-400 text-sm" />
                <span>{text}</span>
              </button>
            ))
          }
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <img
            src={AskOxyLogo}
            className="h-8 sm:h-12 w-auto active:scale-95"
            alt="AskOxy"
            onClick={() => navigate("/")}
          />

          <div className="hidden sm:block flex-grow mx-4">
            {renderSearchBar()}
          </div>

          <div className="sm:hidden flex-grow mx-4">
            {renderSearchBar()}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => navigate("/profile")}
              onMouseDown={() => setActiveButton('profile')}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`flex items-center space-x-1 text-gray-700 
    hover:bg-gray-50 rounded-full px-2 py-1
    hover:text-green-600 transition-all duration-300 
    hover:scale-105 active:scale-95 group
    ${location.pathname === '/profile' ? 'bg-green-50 text-green-600' : ''}`}
            >
              {location.pathname === '/profile' ? (
                <FaUserCircle className="text-xl text-green-600" />
              ) : activeButton === 'profile' ? (
                <FaUserCircle className="text-xl text-green-500" />
              ) : (
                <AiOutlineUser className="text-xl" />
              )}
              <span className="hidden sm:inline">Profile</span>
            </button>

            <button
              onClick={() => navigate("/mycart")}
              onMouseDown={() => setActiveButton('cart')}
              onMouseUp={() => setActiveButton(null)}
              onMouseLeave={() => setActiveButton(null)}
              className={`relative flex items-center space-x-1 text-gray-700 
    hover:bg-gray-50 rounded-full px-2 py-1
    hover:text-blue-600 transition-all duration-300 
    hover:scale-105 active:scale-95 group
    ${location.pathname === '/mycart' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              {location.pathname === '/mycart' ? (
                <FaShoppingCart className="text-xl text-blue-600" />
              ) : activeButton === 'cart' ? (
                <FaShoppingCart className="text-xl text-blue-500" />
              ) : (
                <AiOutlineShoppingCart className="text-xl" />
              )}
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
      font-bold rounded-full w-5 h-5 flex items-center justify-center
      group-hover:bg-red-600 transition-colors">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;