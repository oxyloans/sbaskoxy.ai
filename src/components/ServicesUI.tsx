import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HM1 from "../assets/img/ORDER RICE ONLINE.png";
import HM2 from "../assets/img/Groceries.png";
import HM3 from "../assets/img/Tickets.png";
import HM4 from "../assets/img/Transportation.png";
import HM5 from "../assets/img/Education.png";
import HM6 from "../assets/img/Food & Beverage.png";
import HM7 from "../assets/img/games.png";
import HM8 from "../assets/img/legal services.png";
import HM9 from "../assets/img/Pets.png";
import HM10 from "../assets/img/event-management-strategy (1).png";
import HM11 from "../assets/img/Influencers gpt (1).png";
import HM12 from "../assets/img/Transportation.png";
import HM13 from "../assets/img/financial advisory (1).png";
import HM14 from "../assets/img/loan services.png";
import HM15 from "../assets/img/Health & Wellness.png";
import HM16 from "../assets/img/X5.png";
import HM17 from "../assets/img/Advertising service (2).png";
import HM18 from "../assets/img/Marketing services (1).png";
import HM19 from "../assets/img/X8.png";
import HM20 from "../assets/img/creative services.png";
import HM21 from "../assets/img/freelancer and consulting service.png";
import HM22 from "../assets/img/X11.png";
import HM23 from "../assets/img/freelancer and consulting service.png";
import HM24 from "../assets/img/ca services.png";
import HM25 from "../assets/img/whole sale service (1).png";
import HM26 from "../assets/img/Education.png";
import HM27 from "../assets/img/Beauty (1).png";
import HM28 from "../assets/img/Professional Gpt service (1).png";
import HM29 from "../assets/img/Advertising service (2).png";
import HM30 from "../assets/img/Marketing services (1).png";
import HM31 from "../assets/img/Management service gpt (1).png";
import HM32 from "../assets/img/Home Services.png";
import HM33 from "../assets/img/Automotive.png";
import HM34 from "../assets/img/realestate gpt (1).png";
import HM35 from "../assets/img/Technical service (1).png";
import HM36 from "../assets/img/Street wear gpt.png";
import HM37 from "../assets/img/travell planner ai insurai.png";
import HM38 from "../assets/img/X38.png";
import HM39 from "../assets/img/Influencers gpt (1).png";
import HM40 from "../assets/img/Shopping.png";
import "./ServicesUi.css";

const HorizontalScrollGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [modalContent, setModalContent] = useState(
    "You are being transferred to the powerful ChatGPT. Please login to continue your experience."
  );
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0); // Track the current placeholder

  const placeholderTexts = [
    'Search "Ask Questions"',
    'Search "Ask Mentorship"',
    'Search "Ask for Funds"',
    'Search "Ask End to End Solution"',
  ];

  const navigate = useNavigate();

  const images = [
    {
      id: 1,
      src: HM1,
      alt: "Order Rice Online",
      category: "Order Rice Online",
      link: "/erice",
    },
    {
      id: 2,
      src: HM2,
      alt: "Groceries",
      category: "Groceries",
      link: "https://chatgpt.com/g/g-oca8vFV4R-grocery-gpt",
    },
    {
      id: 3,
      src: HM3,
      alt: "Tickets",
      category: "Tickets",
      link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
    },
    {
      id: 4,
      src: HM4,
      alt: "Transportation",
      category: "Transportation",
      link: "https://chatgpt.com/g/g-0HtZUgSav-transportai-gpt",
    },
    {
      id: 5,
      src: HM5,
      alt: "Global Education",
      category: "Global Education",
      link: "https://chatgpt.com/g/g-HfWFTK9qV-study-abroad-buddy",
    },
    {
      id: 6,
      src: HM6,
      alt: "Image 6",
      category: "Food & Beverage",
      link: "https://www.askoxy.ai//dashboard",
    },
    {
      id: 7,
      src: HM7,
      alt: "Games",
      category: "Games",
      link: "https://chatgpt.com/g/g-WhoEAgQHk-gamemasterai-gpt",
    },
    {
      id: 8,
      src: HM8,
      alt: "Legal Services",
      category: "Legal Services",
      link: "https://chatgpt.com/g/g-zWr0ULYQ3-legaladviseai-gpt",
    },
    {
      id: 9,
      src: HM9,
      alt: "Pets",
      category: "Pets",
      link: "https://chatgpt.com/g/g-SkIhRjqxp-petcareai-gp",
    },
    {
      id: 10,
      src: HM10,
      alt: "Event Management Services",
      category: "Event Management Services",
      link: "/dashboard",
    },
    {
      id: 11,
      src: HM11,
      alt: "Image 11",
      category: "Influencer Marketing Services",
      link: "https://www.askoxy.ai/dashboard",
    },
    {
      id: 12,
      src: HM12,
      alt: "Image 12",
      category: "Travel and Tour Services",
      link: "https://chatgpt.com/g/g-puZOdL9qn-travelaingpt",
    },
    {
      id: 13,
      src: HM13,
      alt: "Financial Advisory",
      category: "Financial Advisory",
      link: "https://chatgpt.com/g/g-1tjwJY59f-finadviseai-gpt",
    },
    {
      id: 14,
      src: HM14,
      alt: "Loan Servies",
      category: "Loan Servies",
      link: "https://chatgpt.com/g/g-8FZ5veZAp-loainsgpt",
    },
    {
      id: 15,
      src: HM15,
      alt: "Health and Wellness Services",
      category: "Health and Wellness Services",
      link: "https://www.askoxy.ai/dashboard",
    },

    {
      id: 16,
      src: HM17,
      alt: "Advertising Services",
      category: "Advertising Services",
      link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
    },
    {
      id: 17,
      src: HM18,
      alt: "Marketing Services",
      category: "Marketing Services",
      link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
    },

    {
      id: 18,
      src: HM21,
      alt: "Consulting Services",
      category: "Consulting Services",
      link: "https://chatgpt.com/g/g-dKS0DGZaO-businessadviseai-gpt",
    },

    {
      id: 19,
      src: HM23,
      alt: "Freelance Services",
      category: "Freelance Services",
      link: "https://chatgpt.com/g/g-UqWRcL56H-freelancerai-gpt",
    },
    {
      id: 20,
      src: HM24,
      alt: "CA Services",
      category: "CA Services",
      link: "https://chatgpt.com/g/g-hmAPGBqYY-caassistai-gpt",
    },
    {
      id: 21,
      src: HM25,
      alt: "Whole Sale Services",
      category: "Whole Sale Services",
      link: "https://chatgpt.com/g/g-Il6kqNW6F-wholesaleaingpt",
    },
    {
      id: 22,
      src: HM26,
      alt: "Education (Domestic and Global)",
      category: "Education (Domestic and Global)",
      link: "https://chatgpt.com/g/g-YowIvLCKJ-eduai-gpt",
    },

    {
      id: 23,
      src: HM27,
      alt: "Beauty GPT",
      category: "Beauty GPT",
      link: "https://chatgpt.com/g/g-atKXBmoVR-glamai-gpt",
    },
    {
      id: 24,
      src: HM28,
      alt: "Professional Services GPT",
      category: "Professional Services GPT",
      link: "https://chatgpt.com/g/g-zcSFmhyDq-proserveai-gpt",
    },
    {
      id: 25,
      src: HM20,
      alt: "Creative Services GPT",
      category: "Creative Services GPT",
      link: "https://chatgpt.com/g/g-ycPInHA9E-artassistai-gpt",
    },
    {
      id: 26,
      src: HM29,
      alt: "Advertising services GPT",
      category: "Advertising services GPT",
      link: "https://chatgpt.com/g/g-1NeeKkOv7-advertising-services-gpt",
    },
    {
      id: 27,
      src: HM30,
      alt: "Marketing Services GPT",
      category: "Marketing Services GPT",
      link: "https://chatgpt.com/g/g-3HZ8yLPdZ-campaignai-gpt",
    },
    {
      id: 28,
      src: HM31,
      alt: "Management Services GPT",
      category: "Management Services GPT",
      link: "https://chatgpt.com/g/g-gkFpZWjhf-eventmanageai-gpt",
    },

    {
      id: 29,
      src: HM32,
      alt: "Home Service GPT",
      category: "Home Service GPT",
      link: "https://chatgpt.com/g/g-gYP7A9DGj-servaihome-gpt",
    },
    {
      id: 30,
      src: HM33,
      alt: "Automotive Services GPT",
      category: "Automotive Services GPT",
      link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
    },
    {
      id: 31,
      src: HM34,
      alt: "Real Estate Services GPT",
      category: "Real Estate Services GPT",
      link: "https://chatgpt.com/g/g-PczKU2om8-realestateai-gpt",
    },
    {
      id: 31,
      src: HM35,
      alt: "Technical Services GPT",
      category: "Technical Services GPT",
      link: "https://chatgpt.com/g/g-Buk4VV0Ng-techservai-gpt",
    },

    {
      id: 32,
      src: HM36,
      alt: "Streetwear GPT",
      category: "Streetwear GPT",
      link: "https://chatgpt.com/g/g-rdKd46utz-streetweartrendai-gpt",
    },

    {
      id: 33,
      src: HM37,
      alt: "Travel Planner AI",
      category: "Travel Planner AI",
      link: "https://chatgpt.com/g/g-96zscm6Ar-globetrottergpt",
    },
    {
      id: 34,
      src: HM38,
      alt: "InsurAI GPT",
      category: "InsurAI GPT",
      link: "https://chatgpt.com/g/g-JlPzVtjFK-insurai-gpt",
    },
    {
      id: 35,
      src: HM39,
      alt: "Influencers GPT",
      category: "Influencers GPT",
      link: "https://chatgpt.com/g/g-ttxew4llb-influencehub-gpt",
    },
    {
      id: 36,
      src: HM40,
      alt: "Shopping GPT",
      category: "Shopping GPT",
      link: "https://chatgpt.com/g/g-kCDP2g5yE-shopsmartai-gpt",
    },
  ];

  const handleImageClick = (image: any) => {
    // Check if the image link starts with "https"
    if (image.link.startsWith("https")) {
      const userId = localStorage.getItem("userId");

      // Check if userId exists in localStorage
      if (!userId) {
        // Show modal if userId is not found
        setModalContent(
          `You are being transferred to the powerful ChatGPT. Please log in to continue your experience.`
        );
        setShowModal(true);
      } else {
        // Navigate or show another action for logged-in users if needed
        // alert(`User ID is: ${userId}`);
        window.open(image.link, "_blank");
      }
    } else {
      // Navigate to the link if it's not an "https" link
      navigate(image.link);
    }
  };
  const closeModal = () => {
    setShowModal(false);
  };
  // Change placeholder text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholderTexts.length
      );
    }, 4000); // Change every 4 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin");
  };
  const userId = localStorage.getItem("userId");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearch = () => {
    if (userId) {
      // If user is signed in, redirect to dashboard
      window.location.href = `/dashboard/free-chatgpt?query=${encodeURIComponent(
        query
      )}`;
    } else {
      // Otherwise, redirect to normal page
      window.location.href = `/normal?query=${encodeURIComponent(query)}`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prev) => (prev + 1) % placeholderTexts.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = (searchTerm: string) => {
    // Replace with API call if needed
    const sampleData = ["Product A", "Service B", "Category C"];
    setSuggestions(
      sampleData.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  const imageRows = [
    images.slice(0, 12), // First row (ID 1-12)
    images.slice(12, 24), // Second row (ID 13-24)
    images.slice(24, 36), // Third row (ID 25-36)
  ];

  return (
    <div className="relative bg-white min-h-screen">
      {/* Search Bar */}
      <div
        className="search-container flex flex-col items-center justify-center"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 30%, color(display-p3 1 1 1) 55.89%, color(display-p3 1 1 1 / 0) 100%)",
        }}
      >
        <h1 className="logo-heading font-bold text-center text-3xl md:text-4xl">
          <span className="text-blue-900">ASK</span>
          <span className="text-blue-900">OXY</span>
          <span className="text-yellow-600">.AI</span>
        </h1>

        <div
          className="relative w-full m-4 max-w-md mx-auto p-space-8 border-2 border-border-image bg-bg-overlay-fixed-light-20 backdrop-blur-2xl rounded-lg shadow-lg focus-within:z-[10]:shadow-md"
          data-testid="home-search-desktop"
        >
          <div className="flex flex-row justify-center items-center rounded-lg px-4 py-4 shadow-md">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full bg-transparent outline-none px-3 pr-10 h-9 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 rounded-md placeholder-gray-500"
                placeholder={placeholderTexts[currentPlaceholderIndex]}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {/* Search Icon */}
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={handleSearch}
              >
                <FaSearch className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dropdown Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white shadow-lg rounded-md mt-2 max-h-48 overflow-y-auto z-50">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setQuery(item);
                    setSuggestions([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Scrolling Images Section */}
      <div className="relative  overflow-hidden">
        <div className="flex flex-col gap-4">
          {imageRows.map((rowImages, rowIndex) => (
            <div
              key={rowIndex}
              className="relative overflow-hidden"
              onMouseEnter={(e) =>
                e.currentTarget
                  .querySelector(".scroll-animation")
                  ?.classList.add("paused")
              }
              onMouseLeave={(e) =>
                e.currentTarget
                  .querySelector(".scroll-animation")
                  ?.classList.remove("paused")
              }
            >
              <div
                className={`flex space-x-4 w-max animate-infinite-scroll scroll-animation`}
                style={{
                  animationDuration: `${rowIndex % 2 === 0 ? "190s" : "240s"}`,
                  animationDirection: `${
                    rowIndex % 2 === 0 ? "normal" : "reverse"
                  }`,
                }}
              >
                {rowImages.concat(rowImages).map((image, idx) => (
                  <div
                    key={`${image.id}-${idx}`}
                    className="relative cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-[180px] h-[180px]  rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity px-2">
                      <span className="text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg text-sm font-semibold text-center break-words max-w-full">
                        {image.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="modal-container bg-white p-6 rounded-lg max-w-md w-full">
            <p className="text-center text-lg text-gray-700">{modalContent}</p>
            <div className="modal-actions flex justify-center space-x-4 mt-6">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                onClick={handleLoginClick}
              >
                Sign In
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all duration-300"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollGallery;
