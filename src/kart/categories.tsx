import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {message} from 'antd'
const BASE_URL = "https://meta.oxyglobal.tech/api";


interface Item {
  itemName: string;
  itemId: string;
  itemImage: null;
  weightUnit: string;
  itemPrice: number;
  itemMrp: number | string;
}

interface Category {
  categoryName: string;
  categoryImage: String | null;
  items: Item[];
}

interface CategoriesProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryClick: (categoryName: string) => void;
  loading: boolean;
  cart: { [key: string]: number };
  onItemClick: (item: Item) => void;
  updateCart: (cart: { [key: string]: number }) => void;
  customerId: string; // Added customerId as a prop;
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
  customerId, // Retrieve customerId from props,
  updateCartCount
}) => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const navigate = useNavigate(); 

  // Fetch cartItems for a particular customer
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
        localStorage.setItem("cartCount","0");
      }

      setCartData(response.data.customerCartResponseList);

    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []); // Effect to fetch data on mount



  const handleAddToCart = async (item: Item) => {

    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
  
    if (!accessToken || !userId) {
      message.warning("Please login to add items to the cart.");
      
      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        navigate("/whatapplogin"); // Change "/login" to your actual login route
      }, 2000); // 2seconds delay
  
      return;
    }
  
    const data = { customerId: userId, itemId: item.itemId, quantity: 1 };
  
    try {
      await axios.post(`${BASE_URL}/cart-service/cart/add_Items_ToCart`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      fetchCartData(); // Fetch updated cart data
      message.success("Item added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
    }
  };

  const handleIncreaseQuantity = async (item: Item) => {
    try {
      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        { customerId, itemId: item.itemId }
      );
      fetchCartData();
    //  message.success("Item quantity increased successfully");
    } catch (error) {
       console.error("Failed to increase cart item:", error);
       message.error("Error increasing item quantity");
    }
  };

  const handleDecreaseQuantity = async (item: Item) => {
    console.log("item", cartItems[item.itemId]);
    try {
      if (cartItems[item.itemId] > 1) {
        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          { customerId, itemId: item.itemId }
        );
        fetchCartData();
        // message.success("Item decreased in cart successfully.");
      } else {
        const targetCartId = cartData.find((cart) => cart.itemId === item.itemId)?.cartId;
        console.log(cartData, "cartData");

        await axios.delete(
          `${BASE_URL}/cart-service/cart/remove`,
          {
            data: { id: targetCartId },
          }
        );
        fetchCartData();
        message.success("Item removed from cart successfully.");
      }
    } catch (error) {
      console.error("Error decreasing quantity or removing item:", error);
      message.error("Error decreasing item or removing from cart.");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`cursor-pointer bg-purple-50 border rounded-lg p-4 text-center shadow hover:shadow-md transition ${activeCategory === category.categoryName
                  ? "border-blue-800 bg-blue-60"
                  : "border-gray-300"
                }`}
              onClick={() => onCategoryClick(category.categoryName)}
            >
              <div className="w-25 h-25 bg-gray-100 rounded mb-2 flex items-center justify-center">
                <img
                  src={(category.categoryImage as string) || "https://via.placeholder.com/150"}
                  alt={category.categoryName}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                {category.categoryName}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader border-t-4 border-purple-600 w-16 h-16 rounded-full animate-spin"></div>
          </div>
        ) : activeCategory ? (
          <>
            <h2 className="text-center text-lg sm:text-2xl font-semibold text-gray-800 mb-6 mt-5">
              {activeCategory} Items
            </h2>
            <p className="text-center pt-2 pb-4 text-gray-500 text-sm sm:text-base">
              Please select a category.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories
                .find((category) => category.categoryName === activeCategory)
                ?.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-purple-50 border rounded-lg p-4 text-center shadow hover:shadow-md transition hover:scale-105"
                  >
                    <div
                      className="w-25 h-25 bg-gray-100 rounded mb-2 flex items-center justify-center"
                      onClick={() => onItemClick(item)}
                    >
                      <img
                        src={item.itemImage ?? "https://via.placeholder.com/150"} // Fallback image
                        alt={item.itemName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      {item.itemName}
                    </p>

                    <div className="flex items-center justify-between sm:justify-center space-x-2">
                      {cartItems && cartItems[item.itemId] > 0 ? (
                        <>
                          {/* Decrease Quantity Button */}
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => {
                              handleDecreaseQuantity(item);  // Decrease the quantity
                              
                            }}
                          >
                            -
                          </button>

                          {/* Current Quantity */}
                          <span className="text-gray-800 font-bold text-sm sm:text-base">
                            {cartItems[item.itemId]}
                          </span>

                          {/* Increase Quantity Button */}
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => {
                              handleIncreaseQuantity(item);  // Increase the quantity
                            }}
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          className="flex-1 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base text-center"
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <p className="text-center pt-4 text-gray-500 text-sm sm:text-base">
           
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
