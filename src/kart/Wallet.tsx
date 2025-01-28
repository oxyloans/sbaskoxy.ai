import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { FaBars, FaTimes } from 'react-icons/fa'; 

const MyWalletPage = () => {
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
        <main className="flex-1 bg-white shadow-lg rounded-lg p-4 ml-6">
          <h2 className="text-2xl font-semibold mb-4">My Wallet</h2>

          {/* Wallet Balance Section */}
          <div className="bg-gray-200 p-6 rounded-lg mb-8 shadow-md">
            <h3 className="font-semibold text-xl mb-4">Wallet Balance</h3>
            <p className="text-2xl font-bold">$100.00</p>
          </div>

          {/* Transaction History */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
            <div className="space-y-4">
              <div className="bg-white shadow-md p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p>
                    <span className="font-bold">Transaction ID:</span> tx1234
                  </p>
                  <span className="text-sm text-green-600">+ $50.00</span>
                </div>
                <p>
                  <span className="font-bold">Date:</span> 2025-01-20
                </p>
                <p>
                  <span className="font-bold">Payment Method:</span> Credit Card
                </p>
              </div>
              <div className="bg-white shadow-md p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p>
                    <span className="font-bold">Transaction ID:</span> tx5678
                  </p>
                  <span className="text-sm text-red-600">- $20.00</span>
                </div>
                <p>
                  <span className="font-bold">Date:</span> 2025-01-18
                </p>
                <p>
                  <span className="font-bold">Payment Method:</span> PayPal
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyWalletPage;
