import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from 'antd';
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "https://meta.oxyglobal.tech/api";

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

interface CategoriesProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
  loading: boolean;
  cart: { [key: string]: number };
  onItemClick: (item: Item) => void;
  updateCart: (cart: { [key: string]: number }) => void;
  customerId: string;
  updateCartCount: (count: number) => void;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  loading,
  cart,
  onItemClick,
  updateCart,
  customerId,
  updateCartCount
}) => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    const Id = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${Id}`
      );
      
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data?.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        localStorage.setItem("cartCount", response.data?.customerCartResponseList.length.toString());
        setCartItems(cartItemsMap);
        updateCartCount(response.data?.customerCartResponseList.length);
      } else {
        setCartItems({});
        localStorage.setItem("cartCount", "0");
        updateCartCount(0);
      }
      setCartData(response.data.customerCartResponseList);
      
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleAddToCart = async (item: Item) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
  
    if (!accessToken || !userId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => {
        navigate("/whatapplogin");
      }, 2000);
      return;
    }
  
    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId: userId, itemId: item.itemID, quantity: 1 },
        { headers: { Authorization: `Bearer ${accessToken}` }}
      );
      fetchCartData();
      message.success("Item added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
    }
  };

  const handleQuantityChange = async (item: Item, increment: boolean) => {
    try {
      const endpoint = increment 
        ? `${BASE_URL}/cart-service/cart/incrementCartData`
        : `${BASE_URL}/cart-service/cart/decrementCartData`;
      
      if (!increment && cartItems[item.itemID] <= 1) {
        const targetCartId = cartData.find((cart) => cart.itemId === item.itemID)?.cartId;
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: { id: targetCartId },
        });
        message.success("Item removed from cart successfully.");
      } else {
        await axios.patch(endpoint, { customerId, itemId: item.itemID });
      }
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
    }
  };

  const getCurrentCategoryItems = () => {
    if (!activeCategory || activeCategory === "All Categories") {
      return categories.flatMap(cat => cat.zakyaResponseList);
    }
    const category = categories.find(cat => cat.categoryName === activeCategory);
    return category ? category.zakyaResponseList : [];
  };

  return (
    <div className="bg-white shadow-lg px-3 sm:px-6 lg:px-6 py-3">
      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.categoryName
                  ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-50 border border-purple-100"
              }`}
              onClick={() => onCategoryClick(category.categoryName)}
            >
              <div className="flex items-center space-x-2">
                {category.categoryImage && (
                  <img
                    src={category.categoryImage as string}
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span>{category.categoryName}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {getCurrentCategoryItems().map((item, index) => (
            <motion.div
              key={item.itemID}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-purple-50">
                  <img
                    src={item.imageType ?? "https://via.placeholder.com/150"}
                    alt={item.itemName}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] text-sm">
                  {item.itemName}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-600 font-semibold">₹{item.itemPrice}</span>
                  <span className="text-gray-500 line-through text-sm">₹{item.itemMrp}</span>
                </div>

                {cartItems[item.itemID] > 0 ? (
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item, false);
                      }}
                    >
                      -
                    </motion.button>
                    <span className="font-medium text-purple-700">{cartItems[item.itemID]}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-purple-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item, true);
                      }}
                    >
                      +
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg transition-all duration-300 hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    Add to Cart
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Categories;