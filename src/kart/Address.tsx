import React, { useState, useEffect } from 'react';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import {isWithinRadius} from "./LocationCheck";

const BASE_URL = "https://meta.oxyglobal.tech/api";

interface Address {
  id?: string;
  flatNo: string;
  landmark: string;
  address: string;
  pincode: string;
  addressType: 'Home' | 'Work' | 'Others';
}

const ManageAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<Address>({
    flatNo: '',
    landmark: '',
    address: '',
    pincode: '',
    addressType: 'Home',
  });
  const [showForm, setShowForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchAddresses();
    const count = parseInt(localStorage.getItem("cartCount") || "0" )
    setCartCount(count)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Error getting location: " + error.message)
      }
    );
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const getCoordinates = async (address: string) => {
    try {
      const API_KEY = "AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;
      const response = await axios.get(url);
      return response.data.results[0]?.geometry.location;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      const fullAddress = formData.flatNo + ',' + formData.landmark + ', ' + formData.address + ', ' + formData.pincode;
      const coordinates = await getCoordinates(fullAddress);

      if (!coordinates) {
        setError('Unable to find location coordinates. Please check the address.');
        return;
      }
      const WithinRadius = await isWithinRadius(coordinates);
      console.log(WithinRadius);
      if(!WithinRadius){
        setError('Sorry, we do not deliver to this location');
        return;
      }

      

      const { lat, lng } = coordinates;
      const data = {
        userId: customerId,
        flatNo: formData.flatNo,
        landMark: formData.landmark,
        address: formData.address,
        pincode: formData.pincode,
        addressType: formData.addressType,
        latitude: lat.toString(),
        longitude: lng.toString(),
      };

      const response = await axios.post(`${BASE_URL}/user-service/addAddress`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        await fetchAddresses(); // Refresh the addresses list
        resetForm();
        setError('');
      }
    } catch (error) {
      setError('Failed to add address. Please try again.');
      console.error("Error adding address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/user-service/deleteAddress/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAddresses(); // Refresh the addresses list
    } catch (error) {
      setError('Failed to delete address. Please try again.');
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      flatNo: '',
      landmark: '',
      address: '',
      pincode: '',
      addressType: 'Home',
    });
    setShowForm(false);
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-purple-600 mb-6">Manage Addresses</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {!showForm ? (
                <div className="w-full lg:w-2/3">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Your Addresses</h3>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No addresses found. Add your first address!
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="w-1/2 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {address.flatNo}
                              </p>
                              <p className="text-gray-600 mt-1">
                                {address.landmark}
                              </p>
                              <p className="text-gray-600">
                                {address.address}
                              </p>
                              <p className="text-gray-600">
                                PIN: {address.pincode}
                              </p>
                              <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                                {address.addressType}
                              </span>
                            </div>
                            <div className="flex sm:flex-col gap-2">
                              <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => address.id && handleDeleteAddress(address.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full lg:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-700 mb-6">Add New Address</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Flat/House Number
                        </label>
                        <input
                          type="text"
                          name="flatNo"
                          value={formData.flatNo}
                          onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter flat/house number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Landmark
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter landmark"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter complete address"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter PIN code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Type
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['Home', 'Work', 'Others'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, addressType: type as 'Home' | 'Work' | 'Others' })}
                            className={`px-6 py-2 rounded-lg ${
                              formData.addressType === type
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            } transition-colors`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        disabled={isLoading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300"
                      >
                        {isLoading ? 'Saving...' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageAddressesPage;