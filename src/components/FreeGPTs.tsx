import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi"; // Search icon from react-icons
import A1 from '../assets/img/robot-hand-holding-earth-planet-600nw-2275579467.png'
import A2 from '../assets/img/abstract-circuit-board-design-white-background-3d-rendering_670147-114742.png'
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
    if (userId) {
      window.location.href = `/dashboard?query=${encodeURIComponent(
        searchQuery
      )}`;
    } else {
      window.location.href = `/normal?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Handle "Enter" key press in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
    <section className="relative py-14 md:py-20 md:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-center overflow-hidden">
      {/* Left Background Image */}
      <div
        className="absolute left-0 top-0 w-1/3 h-full bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${A1})` }}
      ></div>

      {/* Right Background Image */}
      <div
        className="absolute right-0 top-0 w-1/3 h-full bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${A2})` }}
      ></div>

      {/* Heading */}
      <h3 className="relative z-10 text-3xl md:text-4xl font-semibold mb-6 text-[#3c1973]">
        FREE GPTs - Your AI Assistant Awaits
      </h3>

      {/* Content Container */}
      <div className="relative z-10 p-8 bg-white rounded-lg shadow-xl max-w-xl mx-auto">
        {/* Description */}
        <p className="mb-6 text-lg text-gray-700">
          AskOxy.AI is more than just unlimited ChatGPT prompts. We're committed
          to helping you achieve your goals by enabling unlimited queries,
          assigning mentors, arranging funding, and providing end-to-end
          support.
        </p>

        {/* Search Input */}
        <div className="relative flex w-full mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderTexts[currentPlaceholderIndex]}
            className="border p-3 pr-14 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-gray-400 text-sm sm:text-base lg:text-lg"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 text-[#3c1973] top-1/2 transform -translate-y-1/2 px-4 py-2 transition-all duration-300"
          >
            <FiSearch size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FreeGPTs;
