import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import { Menu, X, Filter, Search, Package2, CreditCard } from 'lucide-react';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from "axios";

const BASE_URL = "https://meta.oxyglobal.tech/api/";
const customerId = localStorage.getItem("userId");
const API_URL = `${BASE_URL}order-service/getAllOrders_customerId`;

interface OrderItem {
  itemName: string;
  quantity: number | null;
  price: number;
}

interface OrderHistory {
  status: string;
  createdAt: string;
}

interface OrderData {
  orderItems: OrderItem[];
  orderHistory: OrderHistory[] | null;
}

interface Order {
  newOrderId: string;
  orderId: string;
  grandTotal: string;
  paymentType: string;
  orderStatus: string;
  deliveredDate: string;
  orderDate: string;
  items: OrderItem[];
  orderHistory: OrderHistory[];
}

const MyOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsData, setOrderDetailsData] = useState<OrderData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [allOrders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.post(API_URL, { customerId });
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async (orderId: string): Promise<OrderData | null> => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}order-service/getOrdersByOrderId/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = response.data[0];
      if (!orderData) {
        throw new Error("No order data received");
      }

      // Ensure orderHistory is an array
      if (!Array.isArray(orderData.orderHistory)) {
        orderData.orderHistory = [];
      }

      // Ensure orderItems is an array
      if (!Array.isArray(orderData.orderItems)) {
        orderData.orderItems = [];
      }

      return orderData;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  };

  const handleOrderClick = async (order: Order): Promise<void> => {
    setSelectedOrder(order);
    const details = await getOrderDetails(order.orderId);
    if (details) {
      setOrderDetailsData(details);
      setIsDetailsOpen(true);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      "0": "bg-gray-100 text-gray-600",
      "1": "bg-yellow-100 text-yellow-600",
      "2": "bg-blue-100 text-blue-600",
      "3": "bg-purple-100 text-purple-600",
      "4": "bg-green-100 text-green-600",
      "5": "bg-red-100 text-red-600",
      "6": "bg-orange-100 text-orange-600",
    };
    return statusMap[status] || statusMap["0"];
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      "0": "Incomplete",
      "1": "Placed",
      "2": "Accepted",
      "3": "Assigned",
      "4": "Delivered",
      "5": "Rejected",
      "6": "Cancelled",
    };
    return statusMap[status] || "Unknown";
  };

  const filteredOrders = allOrders.filter((order: Order) => {
    const matchesSearch = searchQuery === '' ||
      order.newOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item: OrderItem) =>
        item.itemName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' ||
      getStatusText(order.orderStatus).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a: Order, b: Order) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      case 'oldest':
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      case 'highestAmount':
        return parseFloat(b.grandTotal.replace('₹', '')) - parseFloat(a.grandTotal.replace('₹', ''));
      case 'lowestAmount':
        return parseFloat(a.grandTotal.replace('₹', '')) - parseFloat(b.grandTotal.replace('₹', ''));
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
              <div className="space-y-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders by ID or items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="placed">Placed</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      {/* <option value="highestAmount">Highest Amount</option>
                      <option value="lowestAmount">Lowest Amount</option> */}
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.newOrderId}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleOrderClick(order)}
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium">{order.newOrderId}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {getStatusText(order.orderStatus)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">{order.grandTotal}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-medium">{order.paymentType === "1" ? "COD" : "Online"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <Package2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                  <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Custom Modal */}
      {isDetailsOpen && selectedOrder && orderDetailsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder.newOrderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {orderDetailsData.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{item.itemName ?? 'N/A'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity ?? 'N/A'}</p>
                        </div>
                        <p className="font-medium">
                          ₹{item.price ? item.price.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Order Timeline</h4>
                  <div className="space-y-3">
                    {orderDetailsData?.orderHistory && Array.isArray(orderDetailsData.orderHistory) ? (
                      orderDetailsData.orderHistory.map((history, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                          <div>
                            <p className="font-medium">{getStatusText(history.status)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(history.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No timeline data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyOrders;