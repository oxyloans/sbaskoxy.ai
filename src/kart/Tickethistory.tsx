import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice'; 
import { FaBars, FaTimes, FaArrowLeft, FaFilter } from 'react-icons/fa';

interface Ticket {
  id: string;
  name: string;
  query: string;
  date: string;
  status: 'pending' | 'resolved' | 'cancelled';
}

const TicketHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(3);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sample tickets data
  const tickets: Ticket[] = [
    {
      id: '#123456',
      name: 'John Doe',
      query: 'Order not delivered',
      date: '01/15/2025',
      status: 'pending'
    },
    {
      id: '#123457',
      name: 'Jane Smith',
      query: 'Product quality issue',
      date: '01/14/2025',
      status: 'resolved'
    },
    {
      id: '#123458',
      name: 'Mike Johnson',
      query: 'Refund request',
      date: '01/13/2025',
      status: 'cancelled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Ticket History</h1>
                      <p className="text-sm text-gray-500">Track and manage your support tickets</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/write-to-us')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                  >
                    Create New Ticket
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-300 hover:border-purple-500 transition-colors"
                  >
                    <FaFilter className="text-gray-500" />
                    <span className="text-sm text-gray-700">Filters</span>
                  </button>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Tickets List */}
              <div className="p-6 space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                        <p className="font-semibold">{ticket.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="font-semibold">{ticket.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Query</p>
                        <p className="font-semibold">{ticket.query}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="font-semibold">{ticket.date}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
                          Write Reply
                        </button>
                        <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                          Cancel Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketHistoryPage;