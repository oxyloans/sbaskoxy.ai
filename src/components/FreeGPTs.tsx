import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
// import A1 from "../assets/img/robot-hand-holding-earth-planet-600nw-2275579467.png";
// import A2 from "../assets/img/abstract-circuit-board-design-white-background-3d-rendering_670147-114742.png";

const FreeGPTs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  const placeholderTexts = [
    "Search Ask Questions",
    "Search Seek Mentorship",
    "Search Request Funds",
    "Search End-to-End Solutions",
  ];
  const userId = localStorage.getItem("userId");

  // Handle search input
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      alert("Please enter a search query."); // Replace with toast if preferred
      return;
    }
    window.location.href = userId
      ? `/main/dashboard/freegpts?query=${encodeURIComponent(trimmedQuery)}`
      : `/freechatgptnormal?query=${encodeURIComponent(trimmedQuery)}`;
  };

  // Handle "Enter" key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-12 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* <div
          className="absolute left-[-10%] top-[-10%] w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-no-repeat bg-contain bg-left opacity-15"
          style={{ backgroundImage: `url(${A1})` }}
        ></div>
        <div
          className="absolute right-[-10%] bottom-[-10%] w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-no-repeat bg-contain bg-right opacity-15"
          style={{ backgroundImage: `url(${A2})` }}
        ></div> */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-[#3c1973] leading-tight">
          Free GPTs - Your AI Companion
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mt-2 mx-auto rounded-full"></div>
        </h3>

        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <p className="mb-4 sm:mb-6 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            ASKOXY.AI offers unlimited ChatGPT prompts, mentorship, funding, and
            end-to-end support to fuel your success.
          </p>

          {/* Search Input */}
          <div className="relative flex w-full max-w-xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholderTexts[currentPlaceholderIndex]}
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 bg-white text-sm sm:text-base md:text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3c1973] shadow-sm"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[#3c1973] p-1"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeGPTs;
