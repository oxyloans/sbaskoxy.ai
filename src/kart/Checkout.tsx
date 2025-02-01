import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { ArrowLeft, CreditCard, Truck, Tag, ShoppingBag } from 'lucide-react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface CartItem {
  itemId: string;
  itemName: string;
  itemPrice: string;
  cartQuantity: string;
}

const CheckoutPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
   const [cartCount, setCartCount] = useState<number>(0);
   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<'online' | 'cash'>('online');
  const navigate = useNavigate();

  const BASE_URL = 'https://meta.oxyglobal.tech/api';
  const customerId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartData(response.data?.customerCartResponseList || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      message.error('Failed to fetch cart items');
    }
  };

  const calculateSubTotal = () => {
    return cartData.reduce(
      (acc, item) => acc + parseFloat(item.itemPrice) * parseInt(item.cartQuantity),
      0
    ).toFixed(2);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      message.warning('Please enter a coupon code');
      return;
    }
    message.info('Coupon functionality to be implemented');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (selectedPayment === 'online') {
        message.info('Redirecting to payment gateway...');
      } else {
        message.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Payment failed. Please try again.');
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
          <div className={`lg:w-64 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <Sidebar />
          </div>

          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <ShoppingBag className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-bold text-purple-600">Checkout Details</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="text-lg font-semibold">Apply Coupon</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-orange-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-orange-600 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      Note: Wallet usage not applicable for this order
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'online'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-green-500'
                            }`}
                          onClick={() => setSelectedPayment('online')}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="font-medium">Online Payment</span>
                        </button>
                        <button
                          className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition ${selectedPayment === 'cash'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-green-500'
                            }`}
                          onClick={() => setSelectedPayment('cash')}
                        >
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                    <div className="p-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold">Order Summary</h2>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items Total</span>
                        <span className="font-medium">₹{calculateSubTotal()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Grand Total</span>
                          <span className="text-lg font-bold text-green-600">₹{calculateSubTotal()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-green-500 text-white py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-green-600 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          'Processing...'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>Proceed to Pay</span>
                            <span className="font-bold">₹{calculateSubTotal()}</span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
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