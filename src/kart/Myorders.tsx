import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import { Menu, X, Filter, Search, ChevronDown, ChevronUp, Calendar, Package2, CreditCard } from 'lucide-react';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import { FaBars, FaTimes } from 'react-icons/fa';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  amount: string;
  payment: string;
  status: 'Placed' | 'Delivered' | 'Rejected' | 'Processing';
  deliveredDate: string;
  items: OrderItem[];
  orderDate: string;
};

const MyOrders: React.FC = () => {
  const allOrders: Order[] = [
    {
      id: 'ac45ggyyjmhg',
      amount: '₹1400.00',
      payment: 'COD',
      status: 'Placed',
      deliveredDate: '2025-01-05',
      orderDate: '2025-01-03',
      items: [
        { name: 'Rice Bag 10kg', quantity: 2, price: 600 },
        { name: 'Dal 1kg', quantity: 1, price: 200 },
      ],
    },
    {
      id: 'bc57klzzpqnw',
      amount: '₹2500.00',
      payment: 'Online',
      status: 'Delivered',
      deliveredDate: '2024-12-15',
      orderDate: '2024-12-13',
      items: [
        { name: 'Wheat Bag 5kg', quantity: 3, price: 750 },
        { name: 'Sugar 2kg', quantity: 1, price: 250 },
      ],
    },
    {
      id: 'cd78ppyyjhkg',
      amount: '₹1800.00',
      payment: 'COD',
      status: 'Rejected',
      deliveredDate: 'N/A',
      orderDate: '2024-12-20',
      items: [{ name: 'Cooking Oil 1L', quantity: 2, price: 900 }],
    },
  ];

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(allOrders);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(3);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      Delivered: 'bg-green-100 text-green-600',
      Rejected: 'bg-red-100 text-red-600',
      Placed: 'bg-yellow-100 text-yellow-600',
      Processing: 'bg-blue-100 text-blue-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const processedOrders = useMemo(() => {
    let result = [...allOrders];

    if (searchQuery) {
      result = result.filter((order) =>
        order.items.some((item) => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((order) => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
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
          return parseFloat(b.amount.replace('₹', '')) - parseFloat(a.amount.replace('₹', ''));
        case 'lowestAmount':
          return parseFloat(a.amount.replace('₹', '')) - parseFloat(b.amount.replace('₹', ''));
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
                <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4 space-y-3">
                    {/* Order Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium">{order.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">{order.payment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium">{formatDate(order.orderDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Date</p>
                        <p className="font-medium">{formatDate(order.deliveredDate)}</p>
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      className="w-full flex justify-between items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <span>Order Details</span>
                      {expandedOrder === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {/* Expanded Content */}
                    {expandedOrder === order.id && (
                      <div className="mt-4 space-y-3 border-t pt-4">
                        <h4 className="font-medium">Order Items</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">₹{item.price}</p>
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