import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi"; // Search icon from react-icons
import A1 from "../assets/img/robot-hand-holding-earth-planet-600nw-2275579467.png";
import A2 from "../assets/img/abstract-circuit-board-design-white-background-3d-rendering_670147-114742.png";

const FreeGPTs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const placeholderTexts = [
    'Search "Ask Questions"',
    'Search "Ask Mentorship"',
    'Search "Ask for Funds"',
    'Search "Ask End to End Solution"',
  ];
  const userId = localStorage.getItem("userId");

  // Handle search input
  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = userId
        ? `/dashboard?query=${encodeURIComponent(searchQuery)}`
        : `/normal?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Handle "Enter" key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Change placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholderTexts.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-16 px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-center min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute left-0 top-0 w-1/3 h-full bg-no-repeat bg-cover bg-center opacity-20 hidden md:block animate-fade-in"
        style={{ backgroundImage: `url(${A1})` }}
      ></div>
      <div
        className="absolute right-0 top-0 w-1/3 h-full bg-no-repeat bg-cover bg-center opacity-20 hidden md:block animate-fade-in"
        style={{ backgroundImage: `url(${A2})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        <h3 className="text-3xl sm:text-2xl md:text-3xl font-bold mb-6 text-[#3c1973] drop-shadow-md leading-tight">
          FREE GPTs - Your AI Assistant Awaits
        </h3>

        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg md:shadow-2xl max-w-2xl mx-auto transition-all duration-300 hover:shadow-xl">
          <p className="mb-6 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            AskOxy.AI is more than just unlimited ChatGPT prompts. We're here to
            help you achieve your goals with unlimited queries, assigned
            mentors, funding support, and complete end-to-end assistance.
          </p>

          {/* Search Input */}
          <div className="relative flex w-full mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderTexts[currentPlaceholderIndex]}
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 bg-gray-50 text-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3c1973] transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3c1973] hover:text-blue-600 transition-all duration-300"
              aria-label="Search"
            >
              <FiSearch size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeGPTs;
