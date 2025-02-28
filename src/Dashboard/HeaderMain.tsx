import React, { useEffect, useState, useContext } from "react";
import { ShoppingCart, UserCircle } from "lucide-react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ValidationPopup from "../kart/ValidationPopup";
import AskOxyLogo from "../assets/img/askoxylogostatic.png";
import { CartContext } from "../until/CartContext";
import axios from "axios";

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface HeaderProps {
  cartCount: number;
  IsMobile5: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Product {
  id: string;
  item_name: string;
  brand: string;
  category_name: string;
  description: string;
  rate: number;
  weight: number;
  weight_unit: string;
  image_type: string;
}

const Header: React.FC<HeaderProps> = ({
  cartCount: propCartCount,
  IsMobile5,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeButton, setActiveButton] = useState<"profile" | "cart" | null>(
    null
  );
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const toggleSidebar = () => {
    IsMobile5((prev: boolean) => !prev);
  };

  const token = localStorage.getItem("accessToken");
  const customerId = localStorage.getItem("userId");

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const searchTexts = [
    "Sonamasoori Rice",
    "Kolam Rice",
    "Brown Rice",
    "HMT Rice",
  ];

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animatePlaceholder = async () => {
      const currentText = `Search for "${searchTexts[currentSearchIndex]}"`;
      setSearchPlaceholder(currentText);

      timeout = setTimeout(() => {
        setCurrentSearchIndex((prev) => (prev + 1) % searchTexts.length);
      }, 3000);
    };

    animatePlaceholder();
    return () => clearTimeout(timeout);
  }, [currentSearchIndex]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCount(response.data.length);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem("profileData");
    console.log("profileData", profileData);

    if (profileData) {
      const parsedData = JSON.parse(profileData);
      console.log("parsedData", parsedData);
      return !!(
        parsedData.userFirstName && parsedData.userFirstName != "" &&
        parsedData.userLastName && parsedData.userLastName != "" &&
        parsedData.customerEmail && parsedData.customerEmail != "" &&
        parsedData.alterMobileNumber && parsedData.alterMobileNumber != ""
      );
    }
    return false;
  };

  const handleCartClick = () => {
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
    } else {
      handleNavigation("/main/mycart");
    }
  };

  const handleProfileRedirect = () => {
    setShowValidationPopup(false);
    handleNavigation("/main/profile");
  };

  // Search API integration
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const mobileNumber = localStorage.getItem("mobileNumber") || "";
      
      const response = await axios.get(
        `${BASE_URL}/product-service/search`, {
          params: {
            page: 0,
            size: 10,
            itemName: query,
            mobileNumber: mobileNumber
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      if (response.data && response.data.products) {
        setSearchResults(response.data.products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Add debounce function for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue) {
        searchProducts(searchValue);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    setSearchValue("");
    setIsFocused(false);
    navigate(`/main/product/${productId}`);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }, 100);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0 && searchValue && !isSearching) {
      return (
        <div className="p-4 text-gray-500 text-center">
          No products found matching "{searchValue}"
        </div>
      );
    }

    return searchResults.map((product) => (
      <button
        key={product.id}
        className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center space-x-3 
        transition-colors duration-200 hover:text-purple-600 border-b border-gray-100 last:border-0"
        onClick={() => handleProductClick(product.id)}
      >
        {product.image_type ? (
          <img 
            src={product.image_type} 
            alt={product.item_name} 
            className="w-10 h-10 object-cover rounded-md"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
            <FaSearch className="text-gray-400 text-xs" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{product.item_name}</span>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mr-2">
              ₹{product.rate}
            </span>
            {product.weight && (
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                {product.weight} {product.weight_unit || 'kg'}
              </span>
            )}
          </div>
        </div>
      </button>
    ));
  };

  const renderSearchBox = () => (
    <div className="relative w-full group">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full 
          text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          outline-none transition-all duration-300 
          hover:border-purple-400 hover:shadow-md 
          group-focus-within:border-purple-500"
        placeholder={searchPlaceholder}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="p-1 text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200"
          >
            <FaTimes className="text-base" />
          </button>
        )}
        <FaSearch
          className={`ml-2 text-base transition-all duration-200
          ${isSearching 
            ? 'text-purple-500 animate-pulse' 
            : 'text-gray-400 group-focus-within:text-purple-500 hover:text-purple-500 hover:scale-110'}`}
        />
      </div>

      {(isFocused || searchValue) && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 
          animate-dropdown max-h-64 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          ) : (
            searchValue ? renderSearchResults() : (
              searchTexts.map((text, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left 
                  hover:bg-purple-50 flex items-center space-x-2 
                  transition-colors duration-200 hover:text-purple-600"
                  onClick={() => {
                    setSearchValue(text);
                    searchProducts(text);
                  }}
                >
                  <FaSearch className="text-gray-400 text-xs" />
                  <span className="text-sm">{text}</span>
                </button>
              ))
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            {/* Left Section: Logo, BuyRice, and Toggle Icon */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="md:hidden block">
                <div className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900">
                  <button
                    onClick={toggleSidebar}
                    className="cursor-pointer text-2xl text-gray-700 hover:text-gray-900"
                  >
                    <FaBars />
                  </button>
                </div>
              </div>

              {/* Logo */}
              <img
                src={AskOxyLogo}
                className="h-8 w-auto sm:h-14 object-contain cursor-pointer"
                alt="AskOxyLogo"
                onClick={() => handleNavigation("/main")}
              />
            </div>

            {/* Middle Section: Search Bar (visible only on desktop) */}
            <div className="hidden sm:block flex-grow mx-4">
              {renderSearchBox()}
            </div>

            {/* Right Section: Search Icon (visible only on mobile) */}
            <div className="sm:hidden flex items-center flex-grow justify-end">
              {!isSearchVisible ? (
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-purple-500"
                >
                  <FaSearch className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute left-0 right-0 top-0 bg-white p-2 h-14 flex items-center z-50">
                  <div className="flex-grow mx-2">{renderSearchBox()}</div>
                  <button
                    onClick={toggleSearch}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Section: Profile and Cart Buttons */}
            <div className="flex space-x-1 sm:space-x-4">
              <button
                onClick={() => handleNavigation("/main/profile")}
                onMouseDown={() => setActiveButton("profile")}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`flex items-center space-x-1 text-gray-700 hover:bg-gray-50 rounded-full p-1 sm:px-2 sm:py-1 
              hover:text-green-600 transition-all duration-300 hover:scale-105 active:scale-95 
              ${
                location.pathname === "/profile"
                  ? "bg-green-50 text-green-600"
                  : ""
              }`}
              >
                <UserCircle
                  size={20}
                  className={`sm:w-6 sm:h-6 transition-colors duration-300 
                ${
                  location.pathname === "/main/profile"
                    ? "text-green-600"
                    : activeButton === "profile"
                    ? "text-green-500"
                    : "text-gray-700"
                }`}
                />
                <span className="hidden sm:inline text-sm">Profile</span>
              </button>

              <button
                onClick={handleCartClick}
                onMouseDown={() => setActiveButton("cart")}
                onMouseUp={() => setActiveButton(null)}
                onMouseLeave={() => setActiveButton(null)}
                className={`relative flex items-center space-x-1 text-gray-700 hover:bg-gray-50 rounded-full p-1 sm:px-2 sm:py-1 
              hover:text-purple-600 transition-all duration-300 hover:scale-105 active:scale-95 
              ${
                location.pathname === "/mycart"
                  ? "bg-purple-50 text-purple-600"
                  : ""
              }`}
              >
                <ShoppingCart
                  size={20}
                  className={`sm:w-6 sm:h-6 transition-colors duration-300 
                ${
                  location.pathname === "/main/mycart"
                    ? "text-purple-700"
                    : activeButton === "cart"
                    ? "text-purple-600"
                    : "text-gray-700"
                }`}
                />
                <span className="hidden sm:inline text-sm">Cart</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        onAction={handleProfileRedirect}
      />
    </>
  );
};

export default Header;