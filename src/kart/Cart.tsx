import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaTags, FaWallet, FaStar, FaSignOutAlt, FaFacebook, FaTwitter, FaInstagram, FaGooglePlay, FaUser, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header3";
import Footer from "../components/Footer";

// Define TypeScript types
interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  itemMrp: string;
  itemImage: string;
  itemDescription: string;
  units: string;
  quantity: string;
  cartId: string;
}

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [cartCount, setCartCount] = useState<number>(0);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
  const [selectedItemDetails, setSelectedItemDetails] = useState<CartItem | null>(null);
  const navigate = useNavigate();
  const BASE_URL = "https://meta.oxyglobal.tech/api"; // Replace with your actual base URL
  const customerId = localStorage.getItem("userId"); // Replace with actual customer ID
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCartData();
  }, []);

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
      const cartItemsMap = response.data.reduce((acc: { [key: string]: number }, item: CartItem) => {
        acc[item.itemId] = parseInt(item.quantity);
        return acc;
      }, {});

      setCartData(response.data);
      setCartItems(cartItemsMap);
      setCartCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleIncrease = async (item: CartItem) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item: CartItem) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const increaseCartItem = async (item: CartItem) => {
    try {
      const currentQuantity = cartItems[item.itemId] || 0;
      const newQuantity = currentQuantity + 1;

      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId: customerId,
          itemId: item.itemId,
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
        [item.itemId]: newQuantity,
      }));
      fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
    }
  };

  const decreaseCartItem = async (item: CartItem) => {
    try {
      const currentQuantity = cartItems[item.itemId];
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;

        await axios.patch(
          `${BASE_URL}/cart-service/cart/decrementCartData`,
          {
            cartQuantity: newQuantity,
            customerId: customerId,
            itemId: item.itemId,
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
          [item.itemId]: newQuantity,
        }));
        fetchCartData();
      } else {
        removeCartItem(item);
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
    }
  };

  const removeCartItem = async (item: CartItem) => {
    try {
      await axios.delete(
        `${BASE_URL}/cart-service/cart/remove`,
        {
          data: {
            id: item.cartId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item removed successfully");
      fetchCartData();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleAddToCart = async (item: CartItem) => {
    const data = { customerId: customerId, itemId: item.itemId, quantity: 1 };
    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Added item to cart:", response.data);
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [item.itemId]: 1,
      }));
      setCartCount((prevCartCount) => prevCartCount + 1);
      fetchCartData();
    } catch (error: any) {
      if (error.response) {
        console.error("Error adding item to cart:", error.response);
      } else {
        console.error("Error adding item to cart:", error.message || error);
      }
    }
  };

  const handleItemImageClick = (item: CartItem) => {
    setSelectedItemDetails(item);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <Header />

      <div className="flex mt-4">
        {/* Cart Items */}
        <main className="flex-1 bg-white shadow p-4">
          {/* Single Cart Item */}
          {cartData.map((item) => (
            <div
              key={item.itemId}
              className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 bg-gray-200 cursor-pointer"
                  onClick={() => handleItemImageClick(item)}
                >
                  <img
                    src={item.itemImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-center md:text-left">{item.itemName}</h3>
                  <p className="text-sm text-center md:text-left">Weight: {item.quantity} {item.units}</p>
                  <p className="text-sm line-through text-red-500 text-center md:text-left">MRP: ₹{item.itemMrp}</p>
                  <p className="text-green-600 font-bold text-center md:text-left">₹{item.itemPrice}</p>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    className="px-3 py-1"
                    onClick={() => handleDecrease(item)}
                    disabled={loadingItems[item.itemId]}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{cartItems[item.itemId]}</span>
                  <button
                    className="px-3 py-1"
                    onClick={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemId]}
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => removeCartItem(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Item Details Modal */}
      {selectedItemDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold">{selectedItemDetails.itemName}</h2>
            <p className="mt-4">{selectedItemDetails.itemDescription}</p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={() => setSelectedItemDetails(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
