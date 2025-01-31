import React, { useEffect, useState } from "react";
import { useNavigate , useLocation} from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { ArrowLeft, CreditCard, Truck, Shield, Gift } from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
}

interface selectedAddress{
  address: string;
  flatNo: string;
  landMark: string;
  pincode: string;
}

const CheckoutPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<"ONLINE" | "COD">("ONLINE");
  const [selectedAddress, setSelectedAddress] = useState<selectedAddress | null>(state?.selectedAddress || null);
  const navigate = useNavigate();

  const BASE_URL = "https://meta.oxyglobal.tech/api";
  const customerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(response.data?.customerCartResponseList || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      message.error("Failed to fetch cart items");
    }
  };

  const calculateSubTotal = () => {
    return cartData
      .reduce(
        (acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
        0
      )
      .toFixed(2);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      message.warning("Please enter a coupon code");
      return;
    }
    message.success("Coupon applied successfully");
  };

  const handlePayment = async () => {
    if (!cartData.length) {
      message.warning("Your cart is empty!");
      return;
    }

    if (!selectedAddress) {
      message.warning("Please select a delivery address.");
      return;
    }

    setLoading(true);

    try {
   
        const requestBody = {
        address: selectedAddress?.address || "Default Address",
        amount: calculateSubTotal(),
        customerId: customerId,
        flatNo: selectedAddress?.flatNo || "N/A",
        landMark: selectedAddress?.landMark || "N/A",
        orderStatus: selectedPayment,
        pincode: selectedAddress?.pincode || "000000",
        walletAmount: "0",
        couponCodeUsed: couponCode || null,
        couponCodeValue: "0",
      };
      const response = await axios.post(
        `${BASE_URL}/order-service/orderPlacedPaymet`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        message.success("Order placed successfully!");
        navigate("/myorders");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      message.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />

      <div className="lg:hidden p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`lg:w-64 ${isSidebarOpen ? "block" : "hidden"} lg:block`}>
            <Sidebar />
          </div>

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back to Cart</span>
              </button>

              <div className="space-y-6">
                <h2 className="text-xl font-bold">Checkout Details</h2>

                {/* Coupon Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4 text-orange-500" />
                    <span>Have a coupon code?</span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code here"
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-500"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedPayment("ONLINE")}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 ${
                      selectedPayment === "ONLINE" ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-green-500" />
                    <p className="font-medium">Online Payment</p>
                  </div>

                  <div
                    onClick={() => setSelectedPayment("COD")}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 ${
                      selectedPayment === "COD" ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <Truck className="w-5 h-5 text-green-500" />
                    <p className="font-medium">Cash on Delivery</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-gray-50">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-green-500 text-white rounded-xl py-3 font-medium hover:bg-green-600 transition-all"
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
