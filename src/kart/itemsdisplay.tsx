import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Modal } from "antd";
import {
  ShoppingCart,
  Home,
  ChevronRight,
  Minus,
  Plus,
  Package2,
  Star,
  Bot,
  X,
  MessageCircle,
  AlertCircle,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import Footer from "../components/Footer";
import { CartContext } from "../until/CartContext";
import { AxiosError } from "axios";
import BASE_URL from "../Config";

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
  image: string;
  quantity: number;
}

interface CartItem {
  itemId: string;
  cartQuantity: number;
  cartId: string;
  status: string;
  itemName: string;
  weight: number;
}

interface Message {
  id: number;
  text: string;
  type: "sent" | "received" | "system";
}

interface ItemImage {
  itemId: string;
  itemName: string;
  imageView: string;
  imageUrl: string;
}

interface GoldPriceUrl {
  id: string;
  goLdUrls: string | null;
  description: string;
}

interface GoldImage {
  id: string;
  imageUrl: string;
}

const COMING_SOON_ITEMS = [
  "Sugar",
  "Wheat Flour (Atta)",
  "Cooking Oil",
  "Salt Crystals",
  "Tea Powder",
  "Coffee Powder",
  "Bread",
  "Peanut Butter",
  "Maggi Noodles",
];

const ItemDisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<Item | null>(
    state?.item || null
  );
  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [showChatSection, setShowChatSection] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const [loadingItems, setLoadingItems] = useState<{
    items: { [key: string]: boolean };
    status: { [key: string]: string };
  }>({
    items: {},
    status: {},
  });
  const [offerModal, setOfferModal] = useState<{
    visible: boolean;
    content: string;
  }>({
    visible: false,
    content: "",
  });
  const [goldPriceModal, setGoldPriceModal] = useState<{
    visible: boolean;
    urls: string[];
    images: GoldImage[];
  }>({
    visible: false,
    urls: [],
    images: [],
  });
  const [displayedOffers, setDisplayedOffers] = useState<Set<string>>(
    new Set()
  );
  const [goldPriceUrls, setGoldPriceUrls] = useState<
    GoldPriceUrl | undefined
  >();

  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartDisplay must be used within a CartProvider");
  }

  const { count, setCount } = context;

  const apiKey = "";

  const isComingSoon = (itemName: string) => {
    return COMING_SOON_ITEMS.includes(itemName);
  };

  const fetchGoldPriceUrls = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/goldUrsBasedOnItemId?itemId=${id}`
      );
      console.log("Gold price URLs response:", response.data);
      setGoldPriceUrls(response.data || null);
    } catch (error) {
      console.error("Error fetching gold price URLs:", error);
    }
  };

  const fetchGoldImages = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/imagePriceBasedOnItemId?itemId=${id}`
      );
      console.log("Gold images response:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching gold images:", error);
      return [];
    }
  };

  const handleComparePrices = async () => {
    if (!itemId) return;
    const urls =
      goldPriceUrls?.goLdUrls?.split(",").map((url) => url.trim()) || [];
    const images = await fetchGoldImages(itemId);
    setGoldPriceModal({ visible: true, urls, images });
  };

  const handleGoldPriceModalClose = () => {
    setGoldPriceModal({ visible: false, urls: [], images: [] });
  };

  const normalizeWeight = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const cleanedValue = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  };

  const fetchItemImages = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/ImagesViewBasedOnItemId?itemId=${id}`
      );
      console.log("Item images response:", response.data);
      setItemImages(response.data || []);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error("Error fetching item images:", error);
      setItemImages([]);
    }
  };

  const fetchItemDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showGroupItemsForCustomrs`
      );
      // Flatten the nested structure to get all items
      const allItems = response.data.flatMap((categoryType: any) =>
        categoryType.categories.flatMap((category: any) =>
          category.itemsResponseDtoList.map((item: any) => ({
            ...item,
            category: category.categoryName,
          }))
        )
      );
      const item = allItems.find((item: Item) => item.itemId === id);
      if (item) {
        setItemDetails(item);
        await fetchItemImages(id);
        if (id === "f2138ee5-21b2-4ece-894f-3ebb84d768a6") {
          await fetchGoldPriceUrls(id);
        }
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (itemId) {
      if (!state?.item) {
        fetchItemDetails(itemId);
      } else {
        setItemDetails(state.item);
        fetchItemImages(itemId);
        fetchRelatedItems();
        if (itemId === "f2138ee5-21b2-4ece-894f-3ebb84d768a6") {
          fetchGoldPriceUrls(itemId);
        }
      }
      fetchCartData("");
    }
  }, [itemId, state]);

  const handleRelatedItemClick = (item: Item) => {
    setItemDetails(item);
    fetchItemImages(item.itemId);
    if (item.itemId !== "f2138ee5-21b2-4ece-894f-3ebb84d768a6") {
      setGoldPriceUrls(undefined);
    } else {
      fetchGoldPriceUrls(item.itemId);
    }
    navigate(`/main/itemsdisplay/${item.itemId}`, {
      state: { item },
      replace: true,
    });
  };

  const handlePreviousImage = () => {
    const totalImages = getAllImages().length;
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const totalImages = getAllImages().length;
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const getAllImages = () => {
    const allImages = [];
    if (itemDetails?.itemImage || itemDetails?.image) {
      allImages.push({
        imageUrl: itemDetails.itemImage || itemDetails.image,
        imageView: "",
        isMainImage: true,
      });
    }
    itemImages.forEach((img) => {
      allImages.push({
        imageUrl: img.imageUrl,
        imageView: img.imageView,
        isMainImage: false,
      });
    });
    return allImages;
  };

  const getCurrentImageUrl = () => {
    const allImages = getAllImages();
    if (allImages.length > 0 && allImages[currentImageIndex]) {
      return allImages[currentImageIndex].imageUrl;
    }
  };

  const getCurrentImageView = () => {
    const allImages = getAllImages();
    if (allImages.length > 0 && allImages[currentImageIndex]) {
      return allImages[currentImageIndex].imageView;
    }
  };

  const fetchCartData = async (itemId: string) => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!userId || !accessToken) {
      setCartItems({});
      setCartData([]);
      setCount(0);
      localStorage.setItem("cartCount", "0");
      return;
    }

    if (itemId) {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: true },
      }));
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/userCartInfo?customerId=${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const customerCart: CartItem[] =
        response.data?.customerCartResponseList || [];

      console.log("fetchCartData API response:", response.data);

      const cartItemsMap: Record<string, number> = customerCart.reduce(
        (acc: Record<string, number>, item: CartItem) => {
          if (item.status === "ADD") {
            const quantity = item.cartQuantity ?? 0;
            acc[item.itemId] = (acc[item.itemId] ?? 0) + quantity;
            console.log(
              `Item ${item.itemId}: quantity=${quantity}, status=${item.status}`
            );
          }
          return acc;
        },
        {}
      );

      const totalQuantity: number = customerCart.reduce(
        (sum: number, item: CartItem) => {
          const quantity = item.cartQuantity ?? 0;
          return sum + quantity;
        },
        0
      );

      console.log("fetchCartData: ", {
        cartItemsMap,
        totalQuantity,
        customerCart,
      });

      const newDisplayedOffers = new Set(displayedOffers);

      const twoPlusOneItems = customerCart.filter(
        (item) => item.status === "ADD" && item.cartQuantity >= 2
      );
      for (const addItem of twoPlusOneItems) {
        const freeItem = customerCart.find(
          (item) =>
            item.itemId === addItem.itemId &&
            item.status === "FREE" &&
            item.cartQuantity === 1 &&
            normalizeWeight(item.weight) === 1.0
        );
        if (
          freeItem &&
          normalizeWeight(addItem.weight) === 1.0 &&
          !newDisplayedOffers.has(`2+1_${addItem.itemId}`)
        ) {
          setOfferModal({
            visible: true,
            content: `<b>2+1 Offer Is Active.</b><br><br>Buy frequent Bags of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get 1 Bag of ${
              freeItem.itemName
            } of ${normalizeWeight(
              freeItem.weight
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
          });
          newDisplayedOffers.add(`2+1_${addItem.itemId}`);
        }
      }

      const fivePlusTwoItems = customerCart.filter(
        (item) =>
          item.status === "ADD" &&
          normalizeWeight(item.weight) === 5.0 &&
          item.cartQuantity >= 1
      );
      for (const addItem of fivePlusTwoItems) {
        const freeItems = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            normalizeWeight(item.weight) === 1.0 &&
            item.cartQuantity === 2
        );
        if (freeItems && !newDisplayedOffers.has(`5+2_${addItem.itemId}`)) {
          setOfferModal({
            visible: true,
            content: `<b>5+2 Offer Is Active.</b><br><br>Buy 1 Bag of ${
              addItem.itemName
            } of ${normalizeWeight(addItem.weight)} Kg and get 2 Bags of ${
              freeItems.itemName
            } of ${normalizeWeight(
              freeItems.weight
            )} Kg for free offer has been applied.<br><br><i style="color: grey;"><strong>Note: </strong>This offer is only applicable once.</i>`,
          });
          newDisplayedOffers.add(`5+2_${addItem.itemId}`);
        }
      }

      const containerOfferItems = customerCart.filter(
        (item) =>
          item.status === "ADD" &&
          (normalizeWeight(item.weight) === 10.0 ||
            normalizeWeight(item.weight) === 26.0) &&
          item.cartQuantity >= 1
      );
      for (const addItem of containerOfferItems) {
        const freeContainer = customerCart.find(
          (item) =>
            item.status === "FREE" &&
            item.cartQuantity === 1 &&
            item.itemName.toLowerCase().includes("storage")
        );
        if (
          freeContainer &&
          !newDisplayedOffers.has(`container_${addItem.itemId}`)
        ) {
          setOfferModal({
            visible: true,
            content: `<b>Special Offer!</b><br>Free Container added to the cart successfully.`,
          });
          newDisplayedOffers.add(`container_${addItem.itemId}`);
        }
      }

      setCartItems(cartItemsMap);
      setCartData(customerCart);
      setCount(totalQuantity);
      localStorage.setItem("cartCount", totalQuantity.toString());
      setDisplayedOffers(newDisplayedOffers);

      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems({});
      setCartData([]);
      setCount(0);
      localStorage.setItem("cartCount", "0");
      if (itemId) {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [itemId]: false },
          status: { ...prev.status, [itemId]: "" },
        }));
      }
      message.error("Failed to fetch cart data.");
    }
  };

  const fetchRelatedItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product-service/showGroupItemsForCustomrs`
      );

      console.log("Fetched Categories:", response.data);

      const matchingCategory = response.data.flatMap((categoryType: any) =>
        categoryType.categories
      ).find((category: any) =>
        category.itemsResponseDtoList.some(
          (item: any) => item.itemId === itemDetails?.itemId
        )
      );

      if (
        matchingCategory &&
        Array.isArray(matchingCategory.itemsResponseDtoList)
      ) {
        const categoryItems = matchingCategory.itemsResponseDtoList
          .filter((item: any) => item.itemId !== itemDetails?.itemId)
          .slice(0, 4)
          .map((item: any) => ({
            ...item,
            category: matchingCategory.categoryName,
          }));

        console.log("Related Items:", categoryItems);
        setRelatedItems(categoryItems);
      } else {
        console.log("No matching category found for this item.");
        setRelatedItems([]);
      }
    } catch (error) {
      console.error("Error fetching related items:", error);
      setRelatedItems([]);
    }
  };

  const handleAddToCart = async (item: Item) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    if (!token || !customerId) {
      message.warning("Please login to add items to the cart.");
      setTimeout(() => navigate("/whatsapplogin"), 2000);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/cart-service/cart/addAndIncrementCart`,
        { customerId, itemId: item.itemId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCartData("");
      message.success("Item added to cart successfully.");
      setTimeout(() => {
        setLoadingItems((prev) => ({
          ...prev,
          items: { ...prev.items, [item.itemId]: false },
        }));
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Error adding to cart.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [itemId]: true },
    }));

    try {
      await axios.patch(
        `${BASE_URL}/cart-service/cart/minusCartItem`,
        { customerId, itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Item removed from cart successfully.");
      await fetchCartData("");
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Error removing item from cart");
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [itemId]: false },
      }));
    }
  };

  const handleQuantityChange = async (item: Item, increment: boolean) => {
    const endpoint = increment
      ? `${BASE_URL}/cart-service/cart/addAndIncrementCart`
      : `${BASE_URL}/cart-service/cart/minusCartItem`;

    if (cartItems[item.itemId] === item.quantity && increment) {
      message.warning("Sorry, Maximum quantity reached.");
      return;
    }

    setLoadingItems((prev) => ({
      ...prev,
      items: { ...prev.items, [item.itemId]: true },
    }));

    try {
      if (!increment && cartItems[item.itemId] <= 1) {
        await axios.patch(
          `${BASE_URL}/cart-service/cart/minusCartItem`,
          { customerId, itemId: item.itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Item removed from cart successfully.");
      } else {
        const requestConfig = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const requestData = { customerId, itemId: item.itemId };

        if (increment) {
          await axios.post(endpoint, requestData, requestConfig);
        } else {
          try {
            const patchRes = await axios.patch(
              endpoint,
              requestData,
              requestConfig
            );
            console.log("PATCH success:", patchRes.status, patchRes.data);
          } catch (error) {
            if (error instanceof AxiosError && error.response) {
              const { status, data } = error.response;
              console.warn("PATCH error response:", status, data);
              if (status === 200 || status === 204) {
                console.log("PATCH treated as error but actually succeeded.");
              } else {
                throw error;
              }
            } else {
              console.error("Network or unknown PATCH error:", error);
              throw error;
            }
          }
        }
      }

      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));

      try {
        await fetchCartData(item.itemId);
      } catch (err) {
        console.error("Error retrieving updated cart data:", err);
        message.error("Cart updated, but failed to refresh view.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Error updating item quantity.");
      setLoadingItems((prev) => ({
        ...prev,
        items: { ...prev.items, [item.itemId]: false },
      }));
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length,
      text: inputMessage,
      type: "sent",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    const mapTypeToRole = (type: Message["type"]) => {
      if (type === "sent") return "user";
      if (type === "received") return "assistant";
      return "system";
    };

    const previousMessages = messages.map((msg) => ({
      role: mapTypeToRole(msg.type),
      content: msg.text,
    }));

    previousMessages.push({
      role: "user",
      content: newMessage.text,
    });

    const getLastAssistantMessage = (msgs: Message[]) => {
      return (
        [...msgs].reverse().find((msg) => msg.type === "received")?.text || ""
      );
    };

    const lastAssistantMessage = getLastAssistantMessage(messages);
    if (lastAssistantMessage) {
      previousMessages.push({
        role: "assistant",
        content: lastAssistantMessage,
      });
    }

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: previousMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: response.data.choices[0].message.content,
          type: "system",
        },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: "Sorry, I couldn't process your request at the moment.",
          type: "system",
        },
      ]);
    }
  };

  const handleChatView = (value: string) => {
    setShowChatSection(!showChatSection);
    if (messages.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: `What would you like to know about ${value}?`,
          type: "system",
        },
      ]);
    }
  };

  const calculateDiscount = (mrp: number, price: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const getStockStatus = (quantity: number, itemName: string) => {
    if (isComingSoon(itemName)) {
      return { text: "Coming Soon", color: "bg-blue-100 text-blue-600" };
    }
    if (quantity === 0) {
      return { text: "Out of Stock", color: "bg-red-100 text-red-600" };
    }
    if (quantity <= 5) {
      return {
        text: `Only ${quantity}`,
        color: "bg-yellow-100 text-yellow-600",
      };
    }
    return { text: "In Stock", color: "bg-green-100 text-green-600" };
  };

  const isMaxStockReached = (item: Item) => {
    return (cartItems[item.itemId] || 0) >= item.quantity;
  };

  const isItemAdded = (itemId: string): boolean => {
    return cartData.some(
      (cartItem: CartItem) =>
        cartItem.itemId === itemId && cartItem.status === "ADD"
    );
  };

  const handleOfferModalClose = () => {
    setOfferModal({ visible: false, content: "" });
  };

  useEffect(() => {
    if (itemDetails) {
      fetchRelatedItems();
    }
  }, [itemDetails]);

  return (
    <div className="min-h-screen">
      <Modal
        title="Special Offer!"
        open={offerModal.visible}
        onCancel={handleOfferModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg hover:from-purple-700 hover:to-purple-900"
            onClick={handleOfferModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "600px" }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: offerModal.content,
          }}
        />
      </Modal>

      <Modal
        title="Compare Gold Prices"
        open={goldPriceModal.visible}
        onCancel={handleGoldPriceModalClose}
        footer={[
          <button
            key="close"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900"
            onClick={handleGoldPriceModalClose}
          >
            Close
          </button>,
        ]}
        centered
        width="90%"
        style={{ maxWidth: "600px" }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gold Item Images
            </h3>
            {goldPriceModal.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {goldPriceModal.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.imageUrl}
                    alt={`Gold item ${index + 1}`}
                    className="w-full h-32 object-contain rounded-lg bg-gray-50"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No additional images available.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gold Price Comparison Links
            </h3>
            <p className="text-gray-600 mb-3">
              Verify the authenticity and check today's gold prices:
            </p>
            {goldPriceModal.urls.length > 0 ? (
              <ul className="space-y-2">
                {goldPriceModal.urls.map((url, index) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No price comparison links available.
              </p>
            )}
          </div>
        </div>
      </Modal>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
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
          <span className="text-purple-600 font-medium">
            {itemDetails?.category}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                    <img
                      src={getCurrentImageUrl()}
                      alt={itemDetails?.itemName}
                      className="w-full h-full object-contain transform transition-transform hover:scale-105"
                    />
                    {getAllImages().length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                        >
                          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>
                  {getAllImages().length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      {getAllImages().map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-purple-600 ring-2 ring-purple-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image.imageUrl}
                            alt={`${itemDetails?.itemName} - ${image.imageView}`}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {itemDetails?.itemId ===
                    "f2138ee5-21b2-4ece-894f-3ebb84d768a6" && (
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleComparePrices}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <span>Compare Prices</span>
                      </button>
                    </div>
                  )}
                  {itemDetails && (
                    <div className="absolute top-4 right-4 flex items-center">
                      <span className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        {calculateDiscount(
                          Number(itemDetails.itemMrp) ||
                            Number(itemDetails.priceMrp),
                          Number(itemDetails.itemPrice)
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                  {itemDetails && (
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-lg ${
                          getStockStatus(itemDetails.quantity, itemDetails.itemName)
                            .color
                        }`}
                      >
                        {
                          getStockStatus(itemDetails.quantity, itemDetails.itemName)
                            .text
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {itemDetails?.itemName}
                    </h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          (4.5) 128 reviews
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{Number(itemDetails?.itemPrice).toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {Number(
                          itemDetails?.itemMrp || itemDetails?.priceMrp
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-gray-900">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Weight:</span>
                        <span className="ml-2 font-medium">
                          {itemDetails?.weight}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Unit:</span>
                        <span className="ml-2 font-medium">
                          {itemDetails?.units}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Stock:</span>
                        <span className="ml-2 font-medium">
                          {itemDetails?.quantity} available
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {itemDetails && cartItems[itemDetails.itemId] > 0 ? (
                      <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleQuantityChange(itemDetails, false)}
                            disabled={
                              loadingItems.items[itemDetails.itemId] ||
                              cartItems[itemDetails.itemId] <= 0
                            }
                            className="w-10 h-10 rounded-full bg-white border border-purple-300 flex items-center justify-center hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            ) : (
                              <Minus className="w-4 h-4 text-purple-600" />
                            )}
                          </button>
                          <span className="text-xl font-semibold text-purple-900 min-w-[3rem] text-center">
                            {cartItems[itemDetails.itemId]}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(itemDetails, true)}
                            disabled={
                              loadingItems.items[itemDetails.itemId] ||
                              isMaxStockReached(itemDetails)
                            }
                            className="w-10 h-10 rounded-full bg-white border border-purple-300 flex items-center justify-center hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loadingItems.items[itemDetails.itemId] ? (
                              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            ) : (
                              <Plus className="w-4 h-4 text-purple-600" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(itemDetails.itemId)}
                          disabled={loadingItems.items[itemDetails.itemId]}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    ) : itemDetails && isComingSoon(itemDetails.itemName) ? (
                      <div className="w-full bg-blue-100 text-blue-600 py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2">
                        <span>Coming Soon</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => itemDetails && handleAddToCart(itemDetails)}
                        disabled={
                          !itemDetails ||
                          itemDetails.quantity === 0 ||
                          loadingItems.items[itemDetails?.itemId || ""]
                        }
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                      >
                        {loadingItems.items[itemDetails?.itemId || ""] ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    )}
                    {itemDetails && isMaxStockReached(itemDetails) && (
                      <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Maximum available quantity reached
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => handleChatView(itemDetails?.itemName || "")}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Bot className="w-5 h-5" />
                      <span>Ask AI about this product</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Product Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {itemDetails?.itemDescription ||
                  "High-quality product with excellent features and benefits. Perfect for your needs with great value for money."}
              </p>
            </div>
            {showChatSection && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-white" />
                      <h3 className="text-lg font-semibold text-white">
                        AI Assistant
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowChatSection(false)}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="h-96 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "sent" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.type === "sent"
                              ? "bg-blue-600 text-white"
                              : message.type === "system"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Ask about this product..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package2 className="w-5 h-5 mr-2 text-purple-600" />
                Related Products
              </h2>
              {relatedItems.length > 0 ? (
                <div className="space-y-4">
                  {relatedItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleRelatedItemClick(item)}
                    >
                      <div className="flex space-x-3">
                        <img
                          src={item.itemImage || item.image}
                          alt={item.itemName}
                          className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.itemName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.weight}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{Number(item.itemPrice).toLocaleString()}
                              </span>
                              {item.itemMrp && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{Number(item.itemMrp).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            {cartItems[item.itemId] > 0 ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(item, false);
                                    }}
                                    disabled={loadingItems.items[item.itemId]}
                                    className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center hover:bg-purple-200 disabled:opacity-50 transition-colors"
                                  >
                                    {loadingItems.items[item.itemId] ? (
                                      <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                                    ) : (
                                      <Minus className="w-3 h-3 text-purple-600" />
                                    )}
                                  </button>
                                  <span className="text-sm font-medium text-purple-900 min-w-[1.5rem] text-center">
                                    {cartItems[item.itemId]}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(item, true);
                                    }}
                                    disabled={
                                      loadingItems.items[item.itemId] ||
                                      isMaxStockReached(item)
                                    }
                                    className="w-6 h-6 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center hover:bg-purple-200 disabled:opacity-50 transition-colors"
                                  >
                                    {loadingItems.items[item.itemId] ? (
                                      <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
                                    ) : (
                                      <Plus className="w-3 h-3 text-purple-600" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : isComingSoon(item.itemName) ? (
                              <div className="w-full bg-blue-100 text-blue-600 py-1.5 px-3 rounded text-sm font-medium flex items-center justify-center">
                                <span>Coming Soon</span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(item);
                                }}
                                disabled={
                                  item.quantity === 0 ||
                                  loadingItems.items[item.itemId]
                                }
                                className="w-full bg-purple-600 text-white py-1.5 px-3 rounded text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-1"
                              >
                                {loadingItems.items[item.itemId] ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Adding...</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart className="w-3 h-3" />
                                    <span>Add</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No related products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItemDisplayPage;