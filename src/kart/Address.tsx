import React, { useState } from 'react';
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";

interface Address {
  flat: string;
  landmark: string;
  address: string;
  pincode: string;
  type: 'Home' | 'Work' | 'Others';
}

const ManageAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [formData, setFormData] = useState<Address>({
    flat: '',
    landmark: '',
    address: '',
    pincode: '',
    type: 'Home',
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, formData]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ flat: '', landmark: '', address: '', pincode: '', type: 'Home' });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
          <h2 className="text-2xl font-semibold text-purple-700 text-gray-700 mb-4">Manage Addresses</h2>

          {/* Address List */}
          {!showForm && (
            <div>
              <h3 className="text-xl font-semibold text-gray-600 mb-4">Your Addresses</h3>
              {addresses.length === 0 ? (
                <p className="text-gray-500">No addresses found. Click "Add New Address" to create one.</p>
              ) : (
                <ul className="space-y-4">
                  {addresses.map((address, index) => (
                    <li
                      key={index}
                      className="bg-white shadow-lg rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div>
                        <p>{address.flat}, {address.landmark}</p>
                        <p>{address.address}</p>
                        <p>{address.pincode}</p>
                        <p className="text-gray-500 text-sm">Type: {address.type}</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => alert('Address selected for confirmation.')}
                        >
                          Select
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() =>
                            setAddresses(addresses.filter((_, i) => i !== index))
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Address
              </button>
            </div>
          )}

          {/* Address Form */}
          {showForm && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">Add New Address</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  name="flat"
                  placeholder="Flat No"
                  value={formData.flat}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <div className="flex space-x-4">
                  {['Home', 'Work', 'Others'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Others' })}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg ${
                        formData.type === type
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="w-full sm:w-auto bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ManageAddressesPage;
