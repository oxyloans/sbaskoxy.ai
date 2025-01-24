import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header3";
import Footer from "../components/Footer";

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://meta.oxyglobal.tech/api/product-service/showItemsForCustomrs",
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

      {/* Promotional Images */}
      <div className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img
          src="https://via.placeholder.com/800x300"
          alt="Promotional Banner 1"
          className="rounded-lg shadow-md w-full object-cover"
        />
        <img
          src="https://via.placeholder.com/800x300"
          alt="Promotional Banner 2"
          className="rounded-lg shadow-md w-full object-cover"
        />
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`cursor-pointer bg-white p-4 rounded-lg shadow-md border text-center transition-transform transform hover:scale-105 ${
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

      {/* Subcategories Section */}
      {activeCategory && (
        <div className="max-w-7xl mx-auto mt-10 px-6">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            {activeCategory} Subcategories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories
              .find((category) => category.categoryName === activeCategory)
              ?.itemsResponseDtoList.map((item, index) => (
                <div
                  key={index}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center shadow hover:shadow-md transition"
                >
                  <div className="flex justify-center mb-2">
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="w-25 h-25 object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-semibold text-purple-800 mb-2">
                    {item.itemName}
                  </p>
                  <div className="flex items-center space-x-2 justify-center">
                    {cart[item.itemName] ? (
                      <>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleDecreaseQuantity(item.itemName)}
                        >
                          -
                        </button>
                        <span className="text-gray-700">
                          {cart[item.itemName]}
                        </span>
                        <button
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleIncreaseQuantity(item.itemName)}
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => handleAddToCart(item.itemName)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Ricebags;