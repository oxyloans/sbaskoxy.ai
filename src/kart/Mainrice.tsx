import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import Categories from "./categories";
import rice1 from "../assets/img/ricecard1.png";
import rice2 from "../assets/img/ricecard2.png";
import rice3 from "../assets/img/ricecard3.png";
import { CartContext } from "../until/CartContext";

interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
  weight: string;
  itemPrice: number;
  quantity: number;
  itemMrp: number;
  units:string;
}

interface SubCategory {
  id: string;
  name: string;
  image?: string | null;
}

interface Category {
  categoryName: string;
  categoryImage: string | null;  // Changed from String | null to string | null
  itemsResponseDtoList: Item[];
  subCategories?: SubCategory[];
}

const Ricebags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All Items");
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [customerId, setCustomerId] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();
  const minSwipeDistance = 50;
  const bannerImages = [rice1, rice2, rice3];

  const handleItemClick = (item: Item) => {
    navigate(`/main/itemsdisplay/${item.itemId}`, { 
      state: { item } 
    });
  };

  const sliderVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count,setCount } = context;

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, bannerImages.length]);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://meta.oxyglobal.tech/api/product-service/showItemsForCustomrs"
        );
        const data: Category[] = response.data;
        
        // Process the API response to include both all categories and individual categories
        const allItemsList = data.flatMap(cat => cat.itemsResponseDtoList);
        
        const allCategories: Category[] = [
          {
            categoryName: "All Items",
            categoryImage: null,
            itemsResponseDtoList: allItemsList,
            subCategories: [] // Initialize empty subcategories for "All Categories"
          },
          ...data.map(category => ({
            ...category,
            subCategories: category.subCategories || [] // Preserve existing subcategories
          }))
        ];
        
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
    setCustomerId(localStorage.getItem("userId") || "");
  }, []);
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
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

    if (isLeftSwipe || isRightSwipe) {
      const direction = isLeftSwipe ? 1 : -1;
      const newIndex = (currentImageIndex + direction + bannerImages.length) % bannerImages.length;
      setCurrentImageIndex(newIndex);
    }

    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  return (
    <div className="min-h-screen">
      {/* Image Slider */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          height: 'min(30vw * 0.5625, 250px)',
          maxHeight: '250px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={1}>
          <motion.div
            key={currentImageIndex}
            custom={1}
            variants={sliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={bannerImages[currentImageIndex]}
              className="w-full h-full object-cover md:object-contain"
              onLoad={() => setImageLoaded(true)}
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
              alt={`Rice banner ${currentImageIndex + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Slider Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10">
          {bannerImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentImageIndex(index);
                setIsAutoPlay(false);
                setTimeout(() => setIsAutoPlay(true), 5000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'w-6 bg-purple-600' 
                  : 'w-1.5 bg-purple-300'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-white">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-2 md:py-6"
        >
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent px-4">
            Premium Quality Rice
          </h1>
          <p className="text-m md:text-lg text-gray-600 px-4">
            Discover our exclusive collection of premium rice varieties
          </p>
        </motion.div>

        <Categories
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={setActiveCategory}
          loading={loading}
          cart={cart}
          onItemClick={handleItemClick}
          updateCart={setCart}
          customerId={customerId}
          updateCartCount={setCount}
        />
      </main>

      {/* Scroll to Top Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 p-3 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white z-50"
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

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex overflow-x-auto py-3 px-4 space-x-4 scrollbar-hide">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.categoryName
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
              onClick={() => setActiveCategory(category.categoryName)}
            >
              {category.categoryName}
            </motion.button>
          ))}
        </div>
      </nav>

 

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 md:w-16 md:h-16 border-4 border-purple-600 border-t-transparent rounded-full"
          />
        </div>
      )}
           <Footer />
    </div>
  );
};

export default Ricebags;