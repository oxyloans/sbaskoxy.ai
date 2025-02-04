import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header3";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";
import { message, notification } from "antd"

// Define Types for API Data
interface Item {
  itemName: string;
  itemID: string;
  imageType: null;
  weightUnit: string;
  itemPrice: number;
  itemMrp: number | string;
}

interface Category {
  categoryName: string;
  categoryImage: String | null;
  zakyaResponseList: Item[];
}


const Ricebags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerId, setCustomerId] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://meta.oxyglobal.tech/api/product-service/getItemsList"
        );

        const data: any[] = response.data;

        // Convert object to array and add manual category
        const manualCategory: Category = {
          categoryName: "Free Container", 
          categoryImage: "https://via.placeholder.com/100x100",
          zakyaResponseList: [],
        };
        
        setCategories([...data, manualCategory]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // message.error("Error");
        // notification.error({
        //   message: "Error",
        //   description: "Error fetching categories",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    setCustomerId(localStorage.getItem("userId") || "");
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) return;

    let isUserInteracting = false;

    const handleInteraction = (state: boolean) => () => {
      isUserInteracting = state;
    };

    container.addEventListener("touchstart", handleInteraction(true));
    container.addEventListener("mousedown", handleInteraction(true));
    container.addEventListener("touchend", handleInteraction(false));
    container.addEventListener("mouseup", handleInteraction(false));

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
      container.removeEventListener("touchstart", handleInteraction(true));
      container.removeEventListener("mousedown", handleInteraction(true));
      container.removeEventListener("touchend", handleInteraction(false));
      container.removeEventListener("mouseup", handleInteraction(false));
    };
  }, [isMobile]);


  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };


const handleItemClick = (item: Item) => {
  console.log({item});
  
    navigate(`/itemsdisplay/${item.itemID}`, { state: { item } });
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <Header cartCount={cartCount} />

      {/* Image Slider Section */}
      <div className="py-6">
        <div
          ref={scrollContainerRef}
          className={`flex gap-4 px-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide ${isMobile ? "snap-center" : ""
            }`}
        >
          {[rice1, rice2, rice3].map((image, index) => (
            <img
              key={index}
              src={image}
              className="w-full max-w-[300px] md:max-w-[500px] h-auto object-cover rounded-lg"
              alt={`Rice ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Dots for Mobile */}
        {isMobile && (
          <div className="flex justify-center mt-4">
            {[rice1, rice2, rice3].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-2 ${currentImage === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="p-6">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Explore Categories
        </h2>
        <Categories
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          loading={loading}
          cart={cart}
          onItemClick={handleItemClick}
          updateCart={setCart}
          customerId={customerId}
          updateCartCount={setCartCount}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ricebags;
