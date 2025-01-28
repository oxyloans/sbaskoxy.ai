import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice"; 
import { FaBars, FaTimes } from 'react-icons/fa'; 


const TicketHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6 ml-0 md:ml-6">
        {/* Ticket History Section */}

          <h1 className="text-xl md:text-2xl font-bold text-purple-700 mb-4">
            Ticket History
          </h1>

          {/* Ticket Status Dropdown */}
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="font-semibold text-sm md:text-base">Ticket Status:</h2>
            <select className="border px-3 py-2 rounded-md text-sm md:text-base w-full sm:w-auto mt-2 sm:mt-0">
              <option>Cancelled</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-4">
            {/* Ticket Card */}
            <div className="border rounded-lg p-4 bg-white shadow-md hover:shadow-xl transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-sm md:text-base">Name</h3>
                  <p className="text-xs md:text-sm">John Doe</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">Ticket ID</h3>
                  <p className="text-xs md:text-sm">#123456</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">Query</h3>
                  <p className="text-xs md:text-sm">Order not delivered</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">Created On</h3>
                  <p className="text-xs md:text-sm">01/15/2025</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:justify-end md:space-x-2 mt-4 space-y-2 md:space-y-0">
  <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm md:text-base hover:bg-purple-700 transition duration-300">
    Write a Reply
  </button>
  <button className="px-4 py-2 bg-gray-300 text-black rounded-md text-sm md:text-base hover:bg-gray-400 transition duration-300">
    Cancel
  </button>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm md:text-base hover:bg-blue-700 transition duration-300">
    View Comments
  </button>
</div>

            </div>
            {/* Additional Ticket Cards can be added here */}
          </div>
      </main>
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TicketHistoryPage;
