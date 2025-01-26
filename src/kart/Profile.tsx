import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddNewAddress = () => {
    navigate('/manageaddresses'); // Redirect to the Manage Addresses page
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Profile Information */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Profile Information</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-500"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-500"
                />
              </div>

              {/* Alternate Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Alternate Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter alternate phone number"
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-500"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">Addresses</h3>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p>Flat No: 101, Landmark: Near Park</p>
                    <p>Address: 123 Street, City</p>
                    <p>Pincode: 123456</p>
                  </div>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    onClick={() => alert('Address Selected')}
                  >
                    Select
                  </button>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p>Flat No: 202, Landmark: Near Mall</p>
                    <p>Address: 456 Avenue, City</p>
                    <p>Pincode: 654321</p>
                  </div>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    onClick={() => alert('Address Selected')}
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Add New Address Button */}
              <button
                onClick={handleAddNewAddress}
                className="mt-6 w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 shadow-md transition-all"
              >
                Add New Address
              </button>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Changes
            </button>
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
