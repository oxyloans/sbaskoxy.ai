import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "./Header3";
import { message } from 'antd';
import { ShoppingCart, Home, ChevronRight, Minus, Plus, Tag, Package2, Star } from 'lucide-react';

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Item {
  itemID: string;
  itemName: string;
  imageType: string;
  itemDescription: string;
  itemMrp: number;
  itemPrice: number;
  quantity: number;
  units: string;
  category: string;
}

interface CartItem {
  itemID: string;
  cartQuantity: number;
  cartId: string;
}

const ItemDisplayPage = () => {
  const { itemID } = useParams<{ itemID: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(state?.item || null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCartData();
  }, [itemID]);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data?.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: CartItem) => {
            acc[item.itemID] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        localStorage.setItem("cartCount", response.data?.customerCartResponseList.length.toString());
        setCartCount(response.data?.customerCartResponseList.length);
        setCartItems(cartItemsMap);
      } else {
        setCartItems({});
        setCartCount(0);
        localStorage.setItem("cartCount","0");
      }
      setCartData(response.data.customerCartResponseList);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleAddToCart = async (item: Item) => {

    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
  
    if (!accessToken || !userId) {
      message.warning("Please login to add items to the cart.");
      
      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        navigate("/whatapplogin"); // Change "/login" to your actual login route
      }, 2000); // 2 seconds delay
  
      return;
    }
  
    const data = { customerId: userId, itemID: item.itemID, quantity: 1 };
  
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

  const increaseCartItem = async (item: Item) => {
    try {
      const currentQuantity = cartItems[item.itemID] || 0;
      const newQuantity = currentQuantity + 1;
      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemID: item.itemID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [item.itemID]: newQuantity,
      }));
      // message.success("Item quantity increased successfully");
      fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
      message.error("Error increasing item quantity");
    }
  };

  const decreaseCartItem = async (item: Item) => {
    try {
      const currentQuantity = cartItems[item.itemID];
      if (currentQuantity === 1) {
        // Remove the item if quantity is 1
        await removeCartItem(item);
      } else {
        const newQuantity = currentQuantity - 1;
        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          {
            cartQuantity: newQuantity,
            customerId,
            itemID: item.itemID,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [item.itemID]: newQuantity,
        }));
        // message.success("Item quantity decreased successfully");
        fetchCartData();
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
      message.error("Error decreasing item quantity");
    }
  };

  const removeCartItem = async (item: Item) => {
    const targetCartId = cartData.find((cart) => cart.itemID === item.itemID)?.cartId;
    console.log(targetCartId);
    if (!targetCartId) return;

    try {
      await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
        data: { id: targetCartId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Update the cart state after removal
      setCartItems((prevCartItems) => {
        const newCartItems = { ...prevCartItems };
        delete newCartItems[item.itemID];
        return newCartItems;
      });
      message.success("Item removed from cart successfully.");
      fetchCartData();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      message.error("Error removing item from cart.");
    }
  };

  const handleIncrease = (item: Item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
    increaseCartItem(item).finally(() =>
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }))
    );
  };

  const handleDecrease = (item: Item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
    decreaseCartItem(item).finally(() =>
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }))
    );
  };

  const renderCartControls = (item: Item, isMainProduct: boolean = false) => {
    const quantity = cartItems[item.itemID] || 0;
    if (quantity > 0) {
      return (
        <div className={`flex items-center ${isMainProduct ? 'justify-start' : 'justify-center'} space-x-3`}>
          {quantity === 1 ? (
            <button
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => removeCartItem(item)}
            >
              Remove
            </button>
          ) : (
            <button
              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              onClick={() => handleDecrease(item)}
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
          <span className="text-gray-800 font-bold min-w-[2rem] text-center">{quantity}</span>
          <button
            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            onClick={() => handleIncrease(item)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      );
    }
    return (
      <button
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${isMainProduct ? 'w-auto' : 'w-full'}`}
        onClick={() => handleAddToCart(item)}
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    );
  };

  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <button
            onClick={() => navigate("/buyRice")}
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Categories</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-purple-600 font-medium">{itemDetails?.category}</span>
        </nav>

        {itemDetails ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Image Section */}
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <img
                  src={itemDetails.imageType}
                  alt={itemDetails.itemName.trim()}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {calculateDiscount(itemDetails.itemMrp, itemDetails.itemPrice)}% OFF
                </div>
              </div>

              {/* Enhanced Details Section */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{itemDetails.itemName.trim()}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  {/* <span className="text-gray-500">(50 reviews)</span> */}
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-purple-600">₹{itemDetails.itemPrice}</span>
                  <span className="text-lg text-gray-500 line-through">₹{itemDetails.itemMrp}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package2 className="w-5 h-5" />
                    <span>Weight: {itemDetails.quantity} {itemDetails.units}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-5 h-5" />
                    <span>Category: {itemDetails.category}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">{itemDetails.itemDescription}</p>

                <div className="mt-auto">
                  {renderCartControls(itemDetails, true)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Enhanced Related Items Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((relatedItem, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img
                    src={relatedItem.imageType}
                    alt={relatedItem.itemName.trim()}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {relatedItem.itemName.trim()}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-purple-600">₹{relatedItem.itemPrice}</span>
                  <span className="text-sm text-gray-500 line-through">₹{relatedItem.itemMrp}</span>
                </div>
                {renderCartControls(relatedItem)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ItemDisplayPage;