import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import axios from 'axios';
import {message} from 'antd';

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Address {
  flatNo: string;
  landmark: string;
  address: string;
  pincode: string;
}

interface ProfileFormData {
  userFirstName: string;
  userLastName: string;
  customerEmail: string;
  alterMobileNumber: string;
  customerId: string;
  whatsappNumber: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState<ProfileFormData>({
    userFirstName: '',
    userLastName: '',
    customerEmail: '',
    alterMobileNumber: '',
    customerId: '',
    whatsappNumber: '',
  });

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  const [isLoading,setIsLoading] = useState<boolean>(false)

  const [addresses, setAddresses] = useState<Address[]>([
  ]);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const handleAddNewAddress = () => {
    navigate('/manageaddresses');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const { whatsappNumber, ...updatedFormData } = formData;
    try {
      const response = await axios.patch(BASE_URL + '/user-service/profileUpdate', updatedFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
       message.success('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile.');
    }
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      // setError('');
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user-service/customerProfileDetails`, {
          params: { customerId },
        });
        const data = response.data;
        setFormData({
          userFirstName: data.firstName || '',
          userLastName: data.lastName || '',
          customerEmail: data.email || '',
          alterMobileNumber: data.alterMobileNumber || '',
          customerId: customerId,
          whatsappNumber: data.whatsappNumber || '',
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
    fetchAddresses();
  }, []);

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
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 p-4">
                  <button
                    className={`pb-4 px-2 ${activeTab === 'personal' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Information
                  </button>
                  <button
                    className={`pb-4 px-2 ${activeTab === 'addresses' ? 'border-b-2 border-purple-600 text-purple-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    Addresses
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="userFirstName"
                          value={formData.userFirstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="userLastName"
                          value={formData.userLastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Alternative Mobile Number</label>
                        <input
                          type="text"
                          name="alterMobileNumber"
                          value={formData.alterMobileNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Enter alternative number"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                        <input
                          type="text"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          readOnly
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedAddress === address 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Flat No:</span> {address.flatNo}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Landmark:</span> {address.landmark}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Address:</span> {address.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Pincode:</span> {address.pincode}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedAddress(address)}
                            className={`mt-4 w-full py-2 rounded-lg transition-colors ${
                              selectedAddress === address
                                ? 'bg-purple-600 text-white'
                                : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                            }`}
                          >
                            {selectedAddress === address ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddNewAddress}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                      >
                        Add New Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;