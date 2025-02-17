import React, { useEffect, useState,useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from 'antd';
import {
  ShoppingCart, Home, ChevronRight, Minus, Plus, Tag,
  Package2, Star, Bot, X, MessageCircle, Heart
} from 'lucide-react';
import ValidationPopup from "./ValidationPopup";
import Footer from "../components/Footer";
import { parse } from "path";
import { CartContext } from "../until/CartContext";

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Item {
  itemId: string;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemMrp: number;
  priceMrp: number | string;
  weight: string;
  itemUrl: string;
  itemPrice: number;
  itemWeight: number;
  weightUnit: string;
  units: string;
  category: string;
  image:string;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
}

interface Message {
  id: number;
  text: string;
  type: "sent" | "received" | "system";
}

const ItemDisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(state?.item || null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const [showChatSection, setShowChatSection] = useState(false);

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count,setCount } = context;
 
  const apiKey =""

  const fetchItemDetails = async (id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/product-service/showItemsForCustomrs`);
      const allItems = response.data.flatMap((category: any) => 
        category.itemsResponseDtoList
      );
      const item = allItems.find((item: Item) =>  item.itemId === id);
      if (item) {
        setItemDetails(item);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Updated useEffect to handle both initial load and navigation
  useEffect(() => {

    console.log({itemId});
    
    if (itemId) {
      if (!state?.item) {
        // If no state is passed, fetch item details
        fetchItemDetails(itemId);
      } else {
        // If state is passed, use it directly
        setItemDetails(state.item);
      }
      fetchCartData();
      fetchRelatedItems();
    }
  }, [itemId, state]); // Added state to dependencies

  // Updated navigation handler for related items
  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item); // Update item details immediately
    navigate(`/itemsdisplay/${item.itemId}`, { 
      state: { item },
      replace: true 
    });
  };

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.customerCartResponseList) {
        const cartItemsMap = response.data.customerCartResponseList.reduce(
          (acc: Record<string, number>, item: CartItem) => {
            acc[item.itemId] = item.cartQuantity || 0;
            return acc;
          },
          {}
        );
        setCartItems(cartItemsMap);
        setCount(response.data?.customerCartResponseList?.length);
      } else {
        setCartItems({});
        setCount(0);
      }
      setCartData(response.data.customerCartResponseList);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleProfileRedirect = () => {
    setShowValidationPopup(false);
    handleNavigation("/main/profile");
  };

  

  const fetchRelatedItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product-service/getItemsList`);

      
        console.log("Fetched Categories:", response.data);
      
        // Find the category that contains the selected item
        const matchingCategory = response.data.find((category: any) =>
          category.itemsResponseDtoList && 
          Array.isArray(category.itemsResponseDtoList) && // Ensure it's an array
          category.itemsResponseDtoList.some((item: any) => 
            item.itemId === itemDetails?.itemId || item.itemId === itemDetails?.itemId
          )
        );
        
        if (matchingCategory && Array.isArray(matchingCategory.itemsResponseDtoList)) {
          // Extract related items, excluding the selected one
          const categoryItems = matchingCategory.itemsResponseDtoList
            .filter((item: any) => 
              item.itemId !== itemDetails?.itemId && item.itemId !== itemDetails?.itemId // Corrected logical condition
            )
            .slice(0, 4); // Limit to 4 items
        
          console.log("Related Items:", categoryItems);
          setRelatedItems(categoryItems);
        } else {
          console.log("No matching category found for this item.");
          setRelatedItems([]);
        }
        
      
} catch (error) {
      console.error("Error fetching related items:", error);
    }
  };

  const checkProfileCompletion = () => {
    const profileData = localStorage.getItem("profileData");
    console.log("profileData", profileData);

    if (profileData) {
      const parsedData = JSON.parse(profileData);
      console.log("parsedData", parsedData);
      return !!(
        parsedData.userFirstName &&  parsedData.userFirstName != "" &&
        parsedData.userLastName &&   parsedData.userLastName != "" &&
        parsedData.customerEmail && parsedData.customerEmail != ""&&
        parsedData.alterMobileNumber && parsedData.alterMobileNumber !=""
      );
    }
    return false;
  };

  const handleAddToCart = async (item: Item) => {
    if (!token || !customerId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => navigate("/whatsapplogin"), 2000);
      return;
    }
    if (!checkProfileCompletion()) {
      setShowValidationPopup(true);
    }

    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/add_Items_ToCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCartData();
      message.success("Item added to cart successfully.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
    }
  };

  const handleQuantityChange = async (item: Item, increment: boolean) => {
    const endpoint = increment
      ? `${BASE_URL}/cart-service/cart/incrementCartData`
      : `${BASE_URL}/cart-service/cart/decrementCartData`;

    try {
      if (!increment && cartItems[item.itemId] <= 1) {
        const targetCartId = cartData.find((cart) => cart.itemId === item.itemId)?.cartId;
        await axios.delete(`${BASE_URL}/cart-service/cart/remove`, {
          data: { id: targetCartId },
          headers: { Authorization: `Bearer ${token}` }
        });
        message.success("Item removed from cart successfully.");
      } else {
        await axios.patch(
          endpoint,
          { customerId, itemId: item.itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {id:messages.length, text: inputMessage, type: 'sent' as const };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    const mapTypeToRole = (type:any) => {
      if (type === 'sent') return 'user';
      if (type === 'received') return 'assistant';
      return 'system';
    };
    
    const previousMessages = messages.map(msg => ({
      role: mapTypeToRole(msg.type),
      content: msg.text,
    }));
    
    // Add new user message to the conversation
    previousMessages.push({
      role: 'user',
      content: newMessage.text,
    });

    // // Function to get the last assistant's response
    // const getLastAssistantMessage = (messages:any) => {
    //   // Find the last message with the type 'received' (which means it's from the assistant)
    //   return messages.reverse().find(msg => msg.type === 'received')?.text || '';
    // };

    // Function to get the last assistant's response safely
  const getLastAssistantMessage = (msgs: Message[]) => {
    return [...msgs].reverse().find((msg) => msg.type === "received")?.text || "";
  };
    
    // Include last assistant response
    const lastAssistantMessage = getLastAssistantMessage(messages);
    if (lastAssistantMessage) {
      previousMessages.push({
        role: 'assistant',
        content: lastAssistantMessage,
      });
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4-turbo",
        messages: previousMessages
      }, {
        headers: {
          'Authorization': `Bearer  ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
      )

      setMessages(prev => [...prev, {
        id:messages.length+2,
        text: response.data.choices[0].message.content,
        type: 'system' as const
      }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, {
        id:messages.length+2,
        text: "Sorry, I couldn't process your request at the moment.",
        type: 'system' as const
      }]);
    }
  };

  const handleChatView=(value:any)=>{
    setShowChatSection(!showChatSection)
    if(messages.length==0){
    setMessages(prev => [...prev, {
      id:messages.length+1,
      text: `What would you like to know about ${value} this product?`,
      type: 'system' as const
    }]);
  }
  }

  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <button
            onClick={() => navigate("/main/dashboard/products")}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={itemDetails?.itemImage || itemDetails?.image }
                      alt={itemDetails?.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {itemDetails &&
                      calculateDiscount(
                        Number(itemDetails.itemMrp) || Number(itemDetails.priceMrp),
                        Number(itemDetails.itemPrice)
                      )}% OFF
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{itemDetails?.itemName}</h1>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-600">(4.8/5)</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-bold text-purple-600">₹{itemDetails?.itemPrice}</span>
                    <span className="text-lg text-gray-500 line-through">₹{itemDetails?.itemMrp || itemDetails?.priceMrp}</span>
                  </div>

                 

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-4">
                    {itemDetails && cartItems[itemDetails.itemId ] ? (
                      <div className="flex items-center space-x-4">
                        <button
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                          onClick={() => itemDetails && handleQuantityChange(itemDetails, false)}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-xl w-8 text-center">
                          {cartItems[itemDetails.itemId]}
                        </span>
                        <button
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                          onClick={() => itemDetails && handleQuantityChange(itemDetails, true)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => itemDetails && handleAddToCart(itemDetails)}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-purple-600" />
                  <span>{itemDetails?.itemWeight || itemDetails?.weight} {itemDetails?.weightUnit || itemDetails?.units}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" />
                  <span>{itemDetails?.category}</span>
                </div>
              </div>
              <p className="text-gray-600">{itemDetails?.itemDescription}</p>
            </div>
          </div>

          {/* Right Column - Chat/Related Items */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-8">
              {/* Chat Section Toggle */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {showChatSection ? 'Product Assistant' : 'Need Help?'}
                  </h2>
                  <button
                    onClick={() => handleChatView(itemDetails?.itemName)}
                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                  >
                    {showChatSection ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                  </button>
                </div>

                {showChatSection && (
                  <div className="h-[400px] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-3 rounded-lg ${msg.type === 'sent'
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-50 border border-purple-100'
                            }`}>
                            {msg.type === 'system'&& (
                              <Bot className="w-4 h-4 text-purple-600 mb-1" />
                            )}
                            <span className="text-sm">{msg.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Ask about this product..."
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Related Items */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Related Items</h2>
                <div className="grid grid-cols-2 gap-4">
                  {relatedItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={item.itemImage || item.image} 
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                          onClick={() => handleRelatedItemClick(item)}
                        />
                        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">
                          {calculateDiscount(item.itemMrp, item.itemPrice)}% OFF
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.itemName}</h3>
                        <div className="flex items-baseline justify-between mb-3">
                          <span className="text-purple-600 font-bold">₹{item.itemPrice}</span>
                          <span className="text-gray-500 text-xs line-through">₹{item.itemMrp}</span>
                        </div>
                        {cartItems[item.itemId] ? (
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              className="p-1.5 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
                              onClick={() => handleQuantityChange(item, false)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-6 text-center">
                              {cartItems[item.itemId]}
                            </span>
                            <button
                              className="p-1.5 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200"
                              onClick={() => handleQuantityChange(item, true)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center gap-1.5 text-sm"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ValidationPopup
        isOpen={showValidationPopup}
        onClose={() => setShowValidationPopup(false)}
        onAction={handleProfileRedirect}
      />
      </div>
      <Footer />

    </div>
    
  );
};

export default ItemDisplayPage;