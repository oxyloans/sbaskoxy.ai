import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing hamburger and close icons
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleAddNewAddress = () => {
    navigate('/manageaddresses'); // Redirect to the Manage Addresses page
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

        {/* Profile Information */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-4 ml-6">
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
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p>Flat No: 101, Landmark: Near Park</p>
                    <p>Address: 123 Street, City</p>
                    <p>Pincode: 123456</p>
                  </div>
                  <button
                    className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
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
                    className="bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                    onClick={() => alert('Address Selected')}
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Add New Address and Save Buttons */}
              <div className="flex flex-row gap-4 w-1/4 sm:flex-row sm:gap-4 sm:justify-between">
                <button
                  onClick={handleAddNewAddress}
                  className="mt-6 w-24 sm:w-auto font-bold bg-purple-600 word-break-all text-white py-2 px-4 rounded-lg shadow-md transition-all"
                >
                  Add New Address
                </button>

                {/* Save Button */}
                <button
                  className="mt-6 w-24 sm:w-auto bg-green-600 font-bold word-break-all text-white py-2 px-4 rounded-lg hover:bg-green-600 shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;
