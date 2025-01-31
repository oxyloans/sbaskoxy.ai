import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { Menu, X, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from 'lucide-react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  method: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

const MyWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(3);
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all');

  const transactions: Transaction[] = [
    {
      id: 'TX1234',
      type: 'credit',
      amount: 1500,
      date: '2025-01-20',
      method: 'Credit Card',
      description: 'Added money to wallet',
      status: 'completed'
    },
    {
      id: 'TX5678',
      type: 'debit',
      amount: 500,
      date: '2025-01-18',
      method: 'PayPal',
      description: 'Purchase payment',
      status: 'completed'
    },
    {
      id: 'TX9012',
      type: 'credit',
      amount: 2000,
      date: '2025-01-15',
      method: 'Bank Transfer',
      description: 'Refund processed',
      status: 'pending'
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Plus className="w-4 h-4" />
                Add Money
              </button>
            </div>

            {/* Wallet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Balance Card */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">Available Balance</h2>
                </div>
                <p className="text-3xl font-bold mb-2">₹2,000.00</p>
                <p className="text-purple-200">Last updated: Today, 10:00 AM</p>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                    <CreditCard className="w-5 h-5" />
                    <span>Add Card</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                    <span>Transfer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Transaction History</h2>

              {/* Transaction Tabs */}
              <div className="flex gap-4 mb-6 border-b">
                {(['all', 'credit', 'debit'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 px-1 capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' 
                          ? <ArrowUpRight className="w-5 h-5" />
                          : <ArrowDownRight className="w-5 h-5" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.date} • {transaction.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyWalletPage;