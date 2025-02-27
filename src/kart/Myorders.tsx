import React, { useState, useEffect } from 'react';
import { Menu, X, Filter, Search, Package2, ChevronDown, MessageSquare, ExternalLink, Eye } from 'lucide-react';
import Footer from '../components/Footer';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://meta.oxyglobal.tech/api/";

interface OrderAddress {
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
}

interface OrderHistory {
  placedDate: string;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
}

interface Item {
  itemName: string;
  itemUrl: string;
  weight: string;
  price: number;
  itemMrpPrice: number;
  quantity: number;
  itemUnit: string;
  singleItemPrice: number;
}

interface OrderDetailsResponse {
  orderId: string;
  orderStatus: string;
  newOrderId: string | null;
  customerMobile: string;
  customerId: string;
  subTotal: number | null;
  grandTotal: number;
  walletAmount: number;
  deliveryFee: number;
  paymentType: number;
  orderDate: string;
  customerName: string;
  orderHistory: OrderHistory[];
  orderAddress: OrderAddress;
  orderItems: Item[];
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailsResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [allOrders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerId, setCustomerId] = useState<string>('');
  
  useEffect(() => {
    // Safe localStorage access during effect, not during render
    const storedCustomerId = localStorage.getItem("userId");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
      // Only fetch orders when we have a valid customer ID
      fetchOrders(storedCustomerId);
    }
  }, []);

  const fetchOrders = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = `${BASE_URL}order-service/getAllOrders_customerId`;
      
      const response = await axios.post(
        API_URL,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string): Promise<void> => {
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

      if (response.data && response.data[0]) {
        setSelectedOrder(response.data[0]);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      "0": "bg-purple-50 text-purple-600",
      "1": "bg-purple-100 text-purple-700",
      "2": "bg-purple-200 text-purple-800",
      "3": "bg-purple-300 text-purple-900",
      "4": "bg-purple-400 text-purple-950",
      "5": "bg-red-100 text-red-600",
      "6": "bg-orange-100 text-orange-600",
      "PickedUp": "bg-green-100 text-green-600",
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
      "PickedUp": "Picked up",
    };
    return statusMap[status] || "Unknown";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWriteToUs = () => {
    if (selectedOrder) {
      // Store the order details in localStorage
      localStorage.setItem("selectedOrderId", selectedOrder.orderId);
      if (selectedOrder.newOrderId) {
        localStorage.setItem("selectedOrderNewId", selectedOrder.newOrderId);
      } else {
        localStorage.removeItem("selectedOrderNewId");
      }

      // Navigate to the WriteToUs page with proper state
      navigate(`/main/writeToUs`, {
        state: {
          orderId: selectedOrder.orderId,
          orderNewId: selectedOrder.newOrderId,
          fromOrdersPage: true  // Add this flag to indicate coming from orders page
        }
      });

      // Close the details modal
      setIsDetailsOpen(false);
    }
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch = searchQuery === '' ||
      (order.orderId && order.orderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.newOrderId && order.newOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ||
      getStatusText(order.orderStatus).toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    }
    return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
  });
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-2 block">Search Order</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by Order ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm text-gray-600 mb-2 block">Status</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="placed">Placed</option>
                  <option value="accepted">Accepted</option>
                  <option value="assigned">Assigned</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">Rejected</option>
                  {/* <option value="cancelled">Cancelled</option> */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm text-gray-600 mb-2 block">Sort By</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Package2 className="h-16 w-16 text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">No orders found</h3>
            <p className="mt-2 text-gray-500">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden hover:shadow transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">#{order.newOrderId}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">₹{order.grandTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment</span>
                      <span className="font-medium">{order.paymentType === 2 ? "Online" : "COD"}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced View Details button */}
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 cursor-pointer transition-all duration-300"
                  onClick={() => fetchOrderDetails(order.orderId)}
                >
                  <div className="px-5 py-3 flex items-center justify-center gap-2 text-white">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">View Order Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isDetailsOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 scrollbar-thin scrollbar-thumb-purple-600">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 sticky top-0 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-1 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <Package2 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-xl font-semibold text-purple-900">Order #{selectedOrder.orderId}</h3>
                  <p className="text-gray-600">{formatDate(selectedOrder.orderDate)}</p>

                  {/* Write to Us button moved here for more prominence */}
                  {/* <button
                    onClick={handleWriteToUs}
                    className="flex items-center justify-center gap-2 mx-auto mt-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Write to us about this order</span>
                  </button> */}
                </div>

                <div className="bg-purple-50 rounded-lg p-4 row">
                  <h4 className="font-semibold text-purple-900 mb-3">Order Status</h4>
                  <div className="flex items-center justify-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3">Delivery Address</h4>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p>{selectedOrder.orderAddress.flatNo}, {selectedOrder.orderAddress.address}</p>
                    <p>Landmark: {selectedOrder.orderAddress.landMark}</p>
                    <p>Pincode: {selectedOrder.orderAddress.pincode}</p>
                    <p>Mobile: {selectedOrder.customerMobile}</p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 hover:border-purple-300 transition-colors"
                    >
                      {/* Item Details on the Left */}
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 cursor-pointer rounded-md overflow-hidden border border-gray-300">
                          {item.itemUrl && (
                            <img
                              src={item.itemUrl}
                              alt={item.itemName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-center md:text-left">{item.itemName}</h3>
                          <p className="text-sm text-center md:text-left">
                            Weight: {item.weight} {item.itemUnit || "KGS"}
                          </p>
                          <p className="text-sm line-through text-red-500 text-center md:text-left"> MRP: ₹{item.itemMrpPrice}</p>
                          <p className="text-green-600 font-bold text-lg text-center md:text-left">₹{item.singleItemPrice}</p>
                        </div>
                      </div>

                      {/* Quantity-Based Price Section on the Right */}
                      <div className="flex flex-col items-center md:items-end">
                        <p className="text-gray-700 text-sm">Qty: {item.quantity}</p>
                        <p className="text-green-600 font-bold">Total: ₹{item.quantity * item.singleItemPrice}</p>
                      </div>
                    </div>
                  ))}
                  <h4 className="font-semibold text-purple-900 mb-3">Payment Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Sub Total</span>
                      <span>₹{selectedOrder.subTotal || selectedOrder.grandTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹{selectedOrder.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wallet Amount</span>
                      <span>₹{selectedOrder.walletAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span>{selectedOrder.paymentType === 2 ? "Online" : "COD"}</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-purple-600">₹{selectedOrder.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.orderHistory && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-3">Order Timeline</h4>

                    {selectedOrder.orderHistory.map((orderHistory, index) => (

                      <div key={index} className="space-y-4">
                        {orderHistory.placedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Placed</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.placedDate)}</p>
                            </div>
                          </div>
                        )}
                        {orderHistory.acceptedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Accepted</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.acceptedDate)}</p>
                            </div>
                          </div>
                        )}

                        {orderHistory.assignedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Assigned</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.assignedDate)}</p>
                            </div>
                          </div>
                        )}

                        {orderHistory.deliveredDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                            <div>
                              <p className="font-medium">Order Delivered</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.deliveredDate)}</p>
                            </div>
                          </div>
                        )}

                        {orderHistory.canceledDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            <div>
                              <p className="font-medium text-red-600">Order Canceled</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.canceledDate)}</p>
                            </div>
                          </div>
                        )}

                        {orderHistory.rejectedDate && (
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            <div>
                              <p className="font-medium text-red-600">Order Rejected</p>
                              <p className="text-sm text-gray-600">{formatDate(orderHistory.rejectedDate)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                    ))}
                  </div>
                )}

                {/* Floating action button for Write To Us at the bottom */}
                <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-center">
                  <button
                    onClick={handleWriteToUs}
                    className="sm:w-3/4 md:w-1/2 lg:w-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg w-full max-w-md"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Write to us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrders;