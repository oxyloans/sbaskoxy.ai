import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import axios from 'axios';
import { message } from 'antd';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { AlertCircle, X, CheckCircle2 } from 'lucide-react';

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

interface ValidationErrors {
  userFirstName?: string;
  userLastName?: string;
  customerEmail?: string;
  alterMobileNumber?: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState('personal');
  const [isValidationPopupOpen, setIsValidationPopupOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.userFirstName.trim()) {
      errors.userFirstName = 'First name is required';
    }
    
    if (!formData.userLastName.trim()) {
      errors.userLastName = 'Last name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please enter a valid email address';
    }
    
    if (!formData.alterMobileNumber.trim()) {
      errors.alterMobileNumber = 'Alternative mobile number is required';
    } else if (!/^\d{10}$/.test(formData.alterMobileNumber)) {
      errors.alterMobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    if (hasAttemptedSubmit) {
      validateForm();
    }
  };

  const handleSaveProfile = async () => {
    setHasAttemptedSubmit(true);
    
    if (!validateForm()) {
      setIsValidationPopupOpen(true);
      return;
    }

    const { whatsappNumber, ...updatedFormData } = formData;
    try {
      setIsLoading(true);
      await axios.patch(
        `${BASE_URL}/user-service/profileUpdate`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success('Profile updated successfully!');
      localStorage.setItem('profileData', JSON.stringify(updatedFormData));
    } catch (error) {
      message.error('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    navigate('/manageaddresses');
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/getAllAdd?customerId=${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data);
    } catch (error) {
      message.error('Error fetching addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/user-service/customerProfileDetails`,
        {
          params: { customerId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setFormData({
        userFirstName: data.firstName || '',
        userLastName: data.lastName || '',
        customerEmail: data.email || '',
        alterMobileNumber: data.alterMobileNumber || '',
        customerId: customerId,
        whatsappNumber: data.whatsappNumber || '',
      });
      const profileData = {
        userFirstName: data.firstName || '',
        userLastName: data.lastName || '',
        customerEmail: data.email || '',
        alterMobileNumber: data.alterMobileNumber || '',
        customerId: customerId,
        whatsappNumber: data.whatsappNumber || '',
      }
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } catch (error) {
      message.error('Error fetching profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(customerId){
      fetchProfileData();
    fetchAddresses();
    }
  }, [customerId]);

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
                    className={`pb-4 px-2 ${
                      activeTab === 'personal'
                        ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('personal')}
                  >
                    Personal Information
                  </button>
                  <button
                    className={`pb-4 px-2 ${
                      activeTab === 'addresses'
                        ? 'border-b-2 border-purple-600 text-purple-600 font-semibold'
                        : 'text-gray-500'
                    }`}
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
                        <label className="text-sm font-medium text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="userFirstName"
                          value={formData.userFirstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.userFirstName
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
                          } focus:border-transparent transition-all`}
                          placeholder="Enter your first name"
                        />
                        {validationErrors.userFirstName && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.userFirstName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="userLastName"
                          value={formData.userLastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.userLastName
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
                          } focus:border-transparent transition-all`}
                          placeholder="Enter your last name"
                        />
                        {validationErrors.userLastName && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.userLastName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.customerEmail
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
                          } focus:border-transparent transition-all`}
                          placeholder="Enter your email"
                        />
                        {validationErrors.customerEmail && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.customerEmail}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Alternative Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="alterMobileNumber"
                          value={formData.alterMobileNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.alterMobileNumber
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-gray-300 focus:ring-2 focus:ring-purple-500'
                          } focus:border-transparent transition-all`}
                          placeholder="Enter alternative number"
                        />
                        {validationErrors.alterMobileNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors.alterMobileNumber}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                          WhatsApp Number
                        </label>
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
                        disabled={isLoading}
                        className={`px-6 py-3 bg-purple-600 text-white rounded-lg transition-colors shadow-md ${
                          isLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-purple-700'
                        }`}
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
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

      {/* Validation Popup */}
      <Dialog
        open={isValidationPopupOpen}
        onClose={() => setIsValidationPopupOpen(false)}
        aria-labelledby="validation-dialog-title"
        PaperProps={{
          sx: { borderRadius: 2, p: 2, maxWidth: '500px' }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            pb: 1
          }}
        >
          <AlertCircle size={24} color="#DC2626" />
          <Typography variant="h6" component="span">
            Required Fields Missing
          </Typography>
          <button
            onClick={() => setIsValidationPopupOpen(false)}
            className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </DialogTitle>

        <DialogContent>
          <div className="mt-2">
            <Typography variant="body1" color="textSecondary">
              Please fill in all required fields:
            </Typography>
            <ul className="mt-2 space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field} className="flex items-center gap-2 text-red-600">
                  <span>•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsValidationPopupOpen(false)}
            startIcon={<CheckCircle2 size={16} />}
            sx={{
              color: 'white',
              bgcolor: '#DC2626',
              '&:hover': { bgcolor: '#B91C1C' },
              px: 3,
              py: 1
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProfilePage;