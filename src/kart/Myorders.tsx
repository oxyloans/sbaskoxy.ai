import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  amount: string;
  payment: string;
  status: string;
  deliveredDate: string;
  items: OrderItem[];
};

const MyOrders: React.FC = () => {
  const allOrders: Order[] = [
    {
      id: 'ac45ggyyjmhg',
      amount: '₹1400.00',
      payment: 'COD',
      status: 'Placed',
      deliveredDate: '2025-01-05',
      items: [
        { name: 'Rice Bag 10kg', quantity: 2 },
        { name: 'Dal 1kg', quantity: 1 },
      ],
    },
    {
      id: 'bc57klzzpqnw',
      amount: '₹2500.00',
      payment: 'Online',
      status: 'Delivered',
      deliveredDate: '2024-12-15',
      items: [
        { name: 'Wheat Bag 5kg', quantity: 3 },
        { name: 'Sugar 2kg', quantity: 1 },
      ],
    },
    {
      id: 'cd78ppyyjhkg',
      amount: '₹1800.00',
      payment: 'COD',
      status: 'Rejected',
      deliveredDate: 'N/A',
      items: [{ name: 'Cooking Oil 1L', quantity: 2 }],
    },
  ];

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(allOrders);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Mobile Sidebar state

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allOrders.filter((order) =>
      order.items.some((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredOrders(filtered);
  };

  const filterOrders = () => {
    const now = new Date();
    let filtered = allOrders;

    switch (filterOption) {
      case '3months':
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        filtered = filtered.filter((order) => new Date(order.deliveredDate) >= threeMonthsAgo);
        break;
      case '6months':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        filtered = filtered.filter((order) => new Date(order.deliveredDate) >= sixMonthsAgo);
        break;
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter((order) => new Date(order.deliveredDate) >= startOfMonth);
        break;
      case 'thisWeek':
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter((order) => new Date(order.deliveredDate) >= startOfWeek);
        break;
      case 'lastYear':
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        filtered = filtered.filter((order) => new Date(order.deliveredDate) >= startOfLastYear);
        break;
      default:
        break;
    }

    setFilteredOrders(filtered);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
{/* Mobile Sidebar Toggle Icon */}
<div className="block lg:hidden p-3">
        <button onClick={toggleSidebar} className="text-gray-800 text-2xl">
          {isSidebarOpen ? <FaTimes /> : <FaBars />} {/* Show hamburger or close icon */}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-3 flex">
        {/* Sidebar */}
        <div className={`lg:flex ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <Sidebar />
        </div>

        {/* Orders Section */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6 ml-0 md:ml-6">
          <div className="space-y-6">
            {/* Filters and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
              {/* Search Input Section */}
              <div className="flex items-center space-x-2 w-full md:w-1/2 mb-2 md:mb-0">
                <input
                  type="text"
                  placeholder="Search for orders"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full py-2 pr-10 pl-4 border border-gray-300 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out hover:border-blue-500"
                />
              </div>

              {/* Filter Dropdown Section */}
              <div className="flex items-center space-x-2 w-full md:w-1/2 justify-end mt-2 md:mt-0">
                <label className="text-sm font-semibold text-gray-700 hidden md:block">Filter Orders:</label>
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  onBlur={filterOrders}
                  className="p-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-auto hover:bg-gray-100 transition-all duration-200 ease-in-out"
                >
                  <option value="all">All Orders</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="thisMonth">This Month</option>
                  <option value="thisWeek">This Week</option>
                  <option value="lastYear">Last Year</option>
                </select>
              </div>
            </div>

            {/* Order List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 shadow-md flex flex-col"
                >
                  <div className="flex justify-between items-center">
                    <p>
                      <span className="font-semibold">Order ID:</span> {order.id}
                    </p>
                    <span
                      className={`text-md font-semibold px-3 py-1 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'Rejected'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p>
                    <span className="font-semibold">Amount:</span> {order.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span> {order.payment}
                  </p>
                  <p>
                    <span className="font-semibold">Delivered On:</span>{' '}
                    {order.deliveredDate}
                  </p>
                  <div className="text-right">
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View More'}
                    </button>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-lg">Order Items:</h4>
                      {order.items.map((item, idx) => (
                        <p key={idx}>
                          {item.name} - {item.quantity} pcs
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyOrders;
