import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Header from "./Header3";

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Item {
  itemId: string;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemMrp: number;
  itemPrice: number;
  quantity: number;
  units: string;
  category: string;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

const ItemDisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(state?.item || null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const customerId = localStorage.getItem("userId"); // Replace with actual customer ID
  const token = localStorage.getItem("accessToken"); // Replace with actual token

  useEffect(() => {
    if (!itemDetails) {
      fetchItemDetails();
    }
    fetchCartData();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}erice-service/user/itemDetails/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setItemDetails(response.data.item);
      setRelatedItems(response.data.relatedItems || []);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

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
      const cartItemsMap = response.data.reduce(
        (acc: Record<string, number>, item: CartItem) => {
          acc[item.itemId] = item.cartQuantity;
          return acc;
        },
        {}
      );
      setCartData(response.data);
      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleAddToCart = async (item: Item) => {
    const data = { customerId, itemId: item.itemId, quantity: 1 };
    try {
      await axios.post(`${BASE_URL}/cart-service/cart/add_Items_ToCart`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prevCartItems) => ({
        ...prevCartItems,
        [item.itemId]: 1,
      }));
      fetchCartData();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const increaseCartItem = async (item: Item) => {
    try {
      const currentQuantity = cartItems[item.itemId] || 0;
      const newQuantity = currentQuantity + 1;
      await axios.patch(
        `${BASE_URL}/cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId,
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

  const decreaseCartItem = async (item: Item) => {
    try {
      const currentQuantity = cartItems[item.itemId];
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
      }
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
    }
  };

  const removeCartItem = async (item: Item) => {
    const targetCartId = cartData.find((cart) => cart.itemId === item.itemId)?.cartId;
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
        delete newCartItems[item.itemId];
        return newCartItems;
      });
      fetchCartData();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleIncrease = (item: Item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    increaseCartItem(item).finally(() =>
      setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }))
    );
  };

  const handleDecrease = (item: Item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    decreaseCartItem(item).finally(() =>
      setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }))
    );
  };

  const renderCartControls = (item: Item) => {
    const quantity = cartItems[item.itemId] || 0;
    if (quantity > 0) {
      return (
        <div className="flex items-center space-x-2">
          {quantity === 1 ? (
            <button
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm sm:text-base"
              onClick={() => removeCartItem(item)}
            >
              Remove
            </button>
          ) : (
            <button
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handleDecrease(item)}
            >
              -
            </button>
          )}

          <span className="text-gray-800 font-bold text-sm sm:text-base">{quantity}</span>
          <button
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handleIncrease(item)}
          >
            +
          </button>
        </div>
      );
    }
    return (
      <button
        className="flex-1 px-2 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base text-center"
        onClick={() => handleAddToCart(item)}
      >
        Add to Cart
      </button>
    );
  };

  return (
    <div>
      <Header />
      <div className="my-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-2 text-gray-500 pl-14">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate("/buyRice")}
          >
            Home
          </span>{" "}
          &gt;{" "}
          <span>
            Categories
          </span>{" "}
          &gt;{" "}
          <span className="text-purple-700 font-semibold">{itemDetails?.category}</span>
        </nav>

        {/* Main Content */}
        {itemDetails ? (
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start">
              {/* Image Section */}
              <div className="w-full lg:w-1/3 aspect-w-1 aspect-h-1 lg:aspect-h-4">
                <img
                  src={itemDetails.itemImage}
                  alt={itemDetails.itemName.trim()}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Details Section */}
              <div className="w-full lg:w-2/3 lg:pl-8 mt-6 lg:mt-0">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">{itemDetails.itemName.trim()}</h2>
                <p className="text-gray-700 mb-4">{itemDetails.itemDescription}</p>
                <p className="text-gray-800 font-medium mb-2">
                  Weight: {itemDetails.quantity} {itemDetails.units}
                </p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-gray-500 line-through text-lg">MRP: ₹{itemDetails.itemMrp}</span>
                  <span className="text-green-600 text-lg font-semibold">₹{itemDetails.itemPrice}</span>
                </div>
                {renderCartControls(itemDetails)}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading item details...</p>
        )}

        {/* Related Items */}
        <h3 className="text-lg font-semibold pl-8 text-purple-700 mt-10 mb-4">Related Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedItems.map((relatedItem, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-full aspect-w-1 aspect-h-1">
                <img
                  src={relatedItem.itemImage}
                  alt={relatedItem.itemName.trim()}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="font-medium text-center mt-4 mb-4">{relatedItem.itemName.trim()}</p>
              {renderCartControls(relatedItem)}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDisplayPage;
