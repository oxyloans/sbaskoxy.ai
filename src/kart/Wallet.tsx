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
        <main className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-6 ml-0 md:ml-6">
  <h2 className="text-2xl font-semibold mb-4">My Wallet</h2>

  {/* Wallet Balance Section */}
  <div className="bg-gray-100 p-4 md:p-6 rounded-lg mb-8 shadow-md flex flex-col md:flex-row md:justify-between items-center">
    <div>
      <h3 className="font-semibold text-lg mb-2 text-gray-700">Wallet Balance</h3>
      <p className="text-xl font-bold text-purple-700">₹2000.00</p>
    </div>
    <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm md:text-base hover:bg-purple-700 transition duration-300 mt-4 md:mt-0">
      Add Money
    </button>
  </div>

  {/* Transaction History */}
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Transaction History</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Transaction Card 1 */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-gray-800">
            <span className="font-bold">Transaction ID:</span> tx1234
          </p>
          <span className="text-sm text-green-600 font-semibold">+ ₹1500.00</span>
        </div>
        <p className="mt-2 text-gray-700">
          <span className="font-bold">Date:</span> 2025-01-20
        </p>
        <p className="text-gray-700">
          <span className="font-bold">Payment Method:</span> Credit Card
        </p>
      </div>

      {/* Transaction Card 2 */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-gray-800">
            <span className="font-bold">Transaction ID:</span> tx5678
          </p>
          <span className="text-sm text-red-600 font-semibold">- ₹500.00</span>
        </div>
        <p className="mt-2 text-gray-700">
          <span className="font-bold">Date:</span> 2025-01-18
        </p>
        <p className="text-gray-700">
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
