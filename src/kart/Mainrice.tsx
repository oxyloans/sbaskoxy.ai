import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header3";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";

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
  const [activeCategory, setActiveCategory] = useState<string>("All Categories");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerId, setCustomerId] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const navigate = useNavigate();
  const minSwipeDistance = 50;

  const bannerImages = [
    {
      src: rice1,
      alt: "Premium Rice Collection",
      title: "Premium Rice Collection",
      description: "Discover our finest selection of premium quality rice"
    },
    {
      src: rice2,
      alt: "Organic Rice Varieties",
      title: "Organic Rice Varieties",
      description: "100% organic rice for your healthy lifestyle"
    },
    {
      src: rice3,
      alt: "Special Offers",
      title: "Special Offers",
      description: "Great deals on bulk purchases"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://meta.oxyglobal.tech/api/product-service/getItemsList"
        );
        const data: Category[] = response.data;
        
        const allCategories: Category[] = [
          {
            categoryName: "All Categories",
            categoryImage: null,
            zakyaResponseList: data.flatMap(cat => cat.zakyaResponseList)
          },
          ...data,
          {
            categoryName: "Free Sample",
            categoryImage: null,
            zakyaResponseList: []
          }
        ];
        
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    setCustomerId(localStorage.getItem("userId") || "");
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleItemClick = (item: Item) => {
    navigate(`/itemsdisplay/${item.itemID}`, { state: { item } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

      <div 
        className="relative w-full overflow-hidden"
        style={{ height: '36vh', minHeight: '200px', maxHeight: '300px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={bannerImages[currentImageIndex].src}
              alt={bannerImages[currentImageIndex].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg md:text-2xl font-bold mb-1"
              >
                {bannerImages[currentImageIndex].title}
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xs md:text-base line-clamp-2"
              >
                {bannerImages[currentImageIndex].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 z-10">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentImageIndex === index 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="hidden md:block">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 hover:bg-white/30"
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 hover:bg-white/30"
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length)}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <main className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Premium Quality Rice
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600">
              Discover our exclusive collection of premium rice varieties
            </p>
          </motion.div>

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
      </main>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 p-3 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg 
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex overflow-x-auto py-2 px-4 space-x-4 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.categoryName
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Ricebags;