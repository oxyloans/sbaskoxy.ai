import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import { Menu, X, Filter, Search, ChevronDown, ChevronUp, Calendar, Package2, CreditCard } from 'lucide-react';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { FaBars, FaTimes,  FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import axios from "axios";

const BASE_URL = "https://meta.oxyglobal.tech/api/";
const customerId = "834ce0d7-125c-4819-ba6d-625eff13c426";
const API_URL = `${BASE_URL}order-service/getAllOrders_customerId`;
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

interface Order {
  newOrderId: string;
  orderId: string;
  grandTotal: string;
  paymentType: string;
  orderStatus: string;
  deliveredDate: string;
  orderDate: string;
  items: OrderItem[]; // for items
  orderItems: { // for the detailed order items structure
    itemName: string;
    quantity: number | null;
    price: number;
    totalPrice: number | null;
    itemId: string;
    mrp: number | null;
  }[];
  orderHistory: { // for order history
    status: string;
    createdAt: string;
  }[];
}

const MyOrders: React.FC = () => {

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [allOrders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(allOrders);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(`${API_URL}`,{customerId});
        setOrders(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);


const getOrdersByOrderId = async (orderId: string) => {
  try {
    const token = localStorage.getItem("token"); // Fetch auth token if needed
    const response = await axios.get(BASE_URL+`/order-service/getOrdersByOrderId/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include auth header if required
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data; // Return order details
    } else {
      throw new Error("Failed to fetch order details.");
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}


// Function to handle toggling order details and fetching data
const toggleOrderDetails = async (orderId: string) => {
  if (expandedOrder === orderId) {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    setOrderData(null); // Reset order details when collapsing
  } else {
    const orderDetails = await getOrdersByOrderId(orderId);
    if (orderDetails) {
      setExpandedOrder(orderId);
      setOrderData(orderDetails); // Store order details in state
    }
  }
};


  
  const getStatusColor = (orderStatus: number | string): string => {
    const statusNumber = Number(orderStatus);
    const colors: Record<number, string> = {
      0: "bg-gray-100 text-gray-600", // Incomplete
      1: "bg-yellow-100 text-yellow-600", // Placed
      2: "bg-blue-100 text-blue-600", // Accepted
      3: "bg-purple-100 text-purple-600", // Assigned
      4: "bg-green-100 text-green-600", // Delivered
      5: "bg-red-100 text-red-600", // Rejected
      6: "bg-orange-100 text-orange-600", // Cancelled
    };
    return colors[statusNumber] || "bg-gray-100 text-gray-600";
  };
  const getOrderStatusText = (orderStatus: number | string): string => {
    const statusNumber = Number(orderStatus);
    switch (statusNumber) {
      case 0:
        return "Incomplete";
      case 1:
        return "Placed";
      case 2:
        return "Accepted";
      case 3:
        return "Assigned";
      case 4:
        return "Delivered";
      case 5:
        return "Rejected";
      case 6:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };
  
  const processedOrders = useMemo(() => {
    let result = [...allOrders];

    if (searchQuery) {
      result = result.filter((order) =>
        order.items.some((item) => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.newOrderId.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => 
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    const now = new Date();
    switch (filterOption) {
      case '3months':
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        result = result.filter((order) => new Date(order.orderDate) >= threeMonthsAgo);
        break;
      case '6months':
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        result = result.filter((order) => new Date(order.orderDate) >= sixMonthsAgo);
        break;
    }

    result.sort((a, b) => {
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

    return result;
  }, [allOrders, searchQuery, statusFilter, filterOption, sortOption]);

  useEffect(() => {
    setFilteredOrders(processedOrders);
  }, [processedOrders]);

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A';
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
            {/* Filters Section */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders by ID or items..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="placed">Placed</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={sortOption}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highestAmount">Highest Amount</option>
                    <option value="lowestAmount">Lowest Amount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.newOrderId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4 space-y-3">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium">{order.newOrderId}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}
                      >
                        {getOrderStatusText(order.orderStatus)}
                      </span>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{order.grandTotal}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">{order.paymentType=="1"?"COD":"Online"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{formatDate(order.orderDate)}</p>
                      </div>
                      <div>
                        {/* <p className="text-sm text-gray-500">Delivery Date</p>
                        <p className="font-medium">{formatDate(order.deliveredDate)}</p> */}
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      className="w-full flex justify-between items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => toggleOrderDetails(order.orderId)} // Ensure orderId is correctly used
                    >
                      <span>Order Details</span>
                      {expandedOrder === order.orderId ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>


                    {/* Expanded Content */}
                    {expandedOrder === order.newOrderId && (
  <div className="mt-4 space-y-3 border-t pt-4">
    <h4 className="font-medium">Order Items</h4>
    {order.orderItems.map((item, idx: number) => (
      <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <p className="font-medium">{item.itemName}</p>
          <p className="text-sm text-gray-500">Qty: {item.quantity ?? 'N/A'}</p>
        </div>
        <p className="font-medium">₹{item.price.toFixed(2)}</p>
      </div>
    ))}

    {/* Order History */}
    <h4 className="font-medium mt-4">Order History</h4>
    {order.orderHistory.map((history: { status: string, createdAt: string }, idx: number) => (
      <div key={idx} className="text-sm text-gray-500">
        Status: {history.status} - {new Date(history.createdAt).toLocaleString()}
      </div>
    ))}
  </div>
)}


                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
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

      <Footer />
    </div>
  );
};

export default MyOrders;