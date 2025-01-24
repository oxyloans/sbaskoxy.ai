import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header3";
import Footer from "../components/Footer";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";

interface Item {
  itemId: string;
  itemName: string;
  itemImage: string;
}

interface Category {
  categoryName: string;
  categoryLogo: string;
  itemsResponseDtoList: Item[];
}

const Ricebags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0); // Track the current image for dots
  const isMobile = window.innerWidth <= 768; // Check for mobile view

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://meta.oxyglobal.tech/api/product-service/showItemsForCustomrs"
        );

        const manualCategory: Category = {
          categoryName: "Free Container",
          categoryLogo: "https://via.placeholder.com/100x100",
          itemsResponseDtoList: [],
        };

        setCategories([...response.data, manualCategory]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) return; // Only enable for mobile view

    let isUserInteracting = false;

    const handleInteractionStart = () => {
      isUserInteracting = true;
    };

    const handleInteractionEnd = () => {
      isUserInteracting = false;
    };

    container.addEventListener("touchstart", handleInteractionStart);
    container.addEventListener("mousedown", handleInteractionStart);
    container.addEventListener("touchend", handleInteractionEnd);
    container.addEventListener("mouseup", handleInteractionEnd);

    const images = container.querySelectorAll("img");
    const interval = setInterval(() => {
      if (isUserInteracting) return;

      setCurrentImage((prev) => {
        const next = (prev + 1) % images.length;
        container.scrollTo({
          left: container.offsetWidth * next,
          behavior: "smooth",
        });
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      container.removeEventListener("touchstart", handleInteractionStart);
      container.removeEventListener("mousedown", handleInteractionStart);
      container.removeEventListener("touchend", handleInteractionEnd);
      container.removeEventListener("mouseup", handleInteractionEnd);
    };
  }, [isMobile]);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleAddToCart = (itemName: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemName]: (prevCart[itemName] || 0) + 1,
    }));
  };

  const handleIncreaseQuantity = (itemName: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemName]: prevCart[itemName] + 1,
    }));
  };

  const handleDecreaseQuantity = (itemName: string) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemName] > 1) {
        updatedCart[itemName] -= 1;
      } else {
        delete updatedCart[itemName];
      }
      return updatedCart;
    });
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Header />

      {/* Top Image Section */}
      <div className="py-6">
        <div
          ref={scrollContainerRef}
          className={`flex gap- px-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide ${
            isMobile ? "snap-center" : ""
          }`}
        >
          <img
            src={rice1}
            className="w-full max-w-[300px] md:max-w-[500px] h-auto object-cover rounded-lg"
            alt="Rice 1"
          />
          <img
            src={rice2}
            className="w-full max-w-[300px] md:max-w-[500px] h-auto object-cover rounded-lg"
            alt="Rice 2"
          />
          <img
            src={rice3}
            className="w-full max-w-[300px] md:max-w-[500px] h-auto object-cover rounded-lg"
            alt="Rice 3"
          />
        </div>

        {/* Dots for Mobile View */}
        {isMobile && (
          <div className="flex justify-center mt-4">
            {[rice1, rice2, rice3].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-2 cursor-pointer ${
                  currentImage === index
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  setCurrentImage(index);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: scrollContainerRef.current.offsetWidth * index,
                      behavior: "smooth",
                    });
                  }
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="p-6">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Explore Categories
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div
            className={`grid ${
              isMobile ? "grid-cols-2" : "grid-cols-4 lg:grid-cols-6"
            } gap-6`}
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className={`cursor-pointer bg-white p-4 rounded-lg shadow-md border text-center transition-transform transform hover:scale-105 hover:border-blue-500 hover:bg-blue-50 ${
                  activeCategory === category.categoryName
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => handleCategoryClick(category.categoryName)}
              >
                <div className="h-20 flex items-center justify-center">
                  <img
                    src={category.categoryLogo}
                    alt={category.categoryName}
                    className="h-full object-contain"
                  />
                </div>
                <p className="mt-2 font-medium text-gray-700">
                  {category.categoryName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ricebags;
