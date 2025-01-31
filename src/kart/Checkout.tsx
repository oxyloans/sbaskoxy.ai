import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
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
  const [cartCount, setCartCount] = useState(0);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
              {/* Left Column - Spans 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Coupon Section */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Apply Coupon</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Wallet Note */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No subscription details found. Wallet usage not applicable.</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Choose Payment Method</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm ${
                        selectedPayment === 'online'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onClick={() => setSelectedPayment('online')}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="font-medium">Online Payment</span>
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm ${
                        selectedPayment === 'cash'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onClick={() => setSelectedPayment('cash')}
                    >
                      <Truck className="w-4 h-4" />
                      <span className="font-medium">Cash on Delivery</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{calculateSubTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex justify-between text-gray-900">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-bold">₹{calculateSubTotal()}</span>
                      </div>
                    </div>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full mt-4 bg-purple-600 text-white py-2 text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Processing...' : selectedPayment === 'online' ? 'Proceed to Pay' : 'Place Order'}
                    </button>
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