import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";

const MyWalletPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      <div className="p-6 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
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
