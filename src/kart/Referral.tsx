import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { 
  Share2, 
  Copy, 
  Link as LinkIcon, 
  X,
  Gift,
  Users,
  TrendingUp
} from 'lucide-react';
import PhoneInput, { isValidPhoneNumber,parsePhoneNumber } from "react-phone-number-input";
import Footer from '../components/Footer';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';
import BASE_URL from '../Config';

interface RefereeDetail {
  id: string;
  whatsappnumber: string;
  firstName: string | null;
  lastName: string | null;
  referenceStatus: string;
  referee: string;
  referrer: string;
  created_at: number[];
}

interface Stats {
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
}

interface UserDetail {
  whatsappNumber: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  id: string;
}

const ReferralPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareAction, setShareAction] = useState<'whatsapp' | 'copy' | null>(null);
  const [refereeDetails, setRefereeDetails] = useState<RefereeDetail[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    activeReferrals: 0,
    conversionRate: 0
  });

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || "";
  const referralLink = `https://www.sandbox.askoxy.ai/whatsappregister?ref=${customerId}`;

  useEffect(() => {
    if (token) {
      fetchRefereeDetails();
      fetchUserDetails();
    }
  }, [token]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user-service/user/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setUserDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateArray: number[]): string => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return 'N/A';
  };

  const fetchRefereeDetails = async () => {
    try {
      const response = await axios.get<RefereeDetail[]>(
        `${BASE_URL}/reference-service/getreferencedetails/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRefereeDetails(response.data);
      
      const total = response.data.length;
      const active = response.data.filter(d => d.referenceStatus === "REGISTERED").length;
      setStats({
        totalReferrals: total,
        activeReferrals: active,
        conversionRate: total > 0 ? (active / total) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching referee details:', error);
    }
  };

  const handleShare = (action: 'whatsapp' | 'copy') => {
    setShareAction(action);
    setPhoneNumber(undefined);
    setError('');
    setIsModalOpen(true);
  };

  // Function to normalize phone numbers for comparison
  const normalizePhoneNumber = (number: string): string => {
    // Remove all non-digit characters
    return number.replace(/\D/g, '');
  };

   useEffect(() => {
      if (phoneNumber) {
        // Extract country code without the + sign
        const phoneNumberS = parsePhoneNumber(phoneNumber)
        console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
        const countryCode = phoneNumberS?.countryCallingCode ? `+${phoneNumberS.countryCallingCode}` : "";
        setCountryCode(countryCode || ""); 
      } else { 
      }
    }, [phoneNumber]);


  const handleSubmit = async () => {
    // Reset error state
    setError('');
    
    // Validate phone number format
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

     // Check for self-referral
     if (localStorage.getItem("whatsappNumber") === phoneNumber) {
      setError('Self-referral is not allowed. Enter a different referral number.');
      return;
    }

    // Check if number has already been referred
    const normalizedInput = normalizePhoneNumber(phoneNumber);
    const alreadyReferred = refereeDetails.some(detail => {
      const normalizedRefNumber = normalizePhoneNumber(detail.whatsappnumber);
      const refSuffix = normalizedRefNumber.slice(-Math.min(10, normalizedRefNumber.length));
      const inputSuffix = normalizedInput.slice(-Math.min(10, normalizedInput.length));
      return refSuffix === inputSuffix;
    });

    if (alreadyReferred) {
      setError('Self-referral is not allowed. Enter a different referral number.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        BASE_URL+'/user-service/inviteaUser',
        {
          referealId: customerId,
          refereeMobileNumber: phoneNumber.replace(countryCode, ''), // Remove country code
          countryCode: countryCode
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setIsModalOpen(false);
      fetchRefereeDetails();
      Modal.success({
        content: response.data.message || 'Referral sent successfully!',
        onOk: () => {},
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);
      
      // Handle different error scenarios
      let errorMessage = 'Failed to invite user. Please try again.';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 409) {
          errorMessage = 'An invitation has already been sent to this user.';
        } else if (error.response.status === 400) {
          // Check if it's a self-referral error from backend
          if (error.response.data && error.response.data.error && 
              error.response.data.error.includes('self')) {
            errorMessage = 'Self-referral is not allowed. Enter a different referral number.';
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; bgColor: string; iconColor: string }> = ({ 
    icon, 
    title, 
    value, 
    bgColor, 
    iconColor 
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${bgColor} rounded-lg`}>
          <div className={`h-6 w-6 ${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<Users />}
              title="Total Referrals"
              value={stats.totalReferrals}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
            <StatCard
              icon={<Gift />}
              title="Active Referrals"
              value={stats.activeReferrals}
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-2xl font-bold mb-6 text-purple-600">Refer a Friend & Earn</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaWhatsapp className="mr-2 text-xl" /> Share via WhatsApp
                </button>
              </div>
            </div>

            {/* Referee Details Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Referee Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">WhatsApp Number</th>
                      <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">Referred Date</th>
                      <th className="border-b p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refereeDetails.map((referee) => (
                      <tr key={referee.id} className="hover:bg-gray-50">
                        <td className="border-b p-4 text-gray-600">{referee.whatsappnumber}</td>
                        <td className="border-b p-4 text-gray-600">{formatDate(referee.created_at)}</td>
                        <td className="border-b p-4">
                          <span 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              referee.referenceStatus === "REGISTERED" 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {referee.referenceStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {refereeDetails.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-8">
                          <p className="text-gray-500">No referee details found.</p>
                          <p className="text-sm text-gray-400 mt-1">Start sharing your referral link to invite friends!</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Enter Referee Details</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">
                  Please enter the phone number of the person you want to refer.
                </p>
                <div className="space-y-4">
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="IN"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      setError(''); // Clear error when user types
                    }}
                    className="w-full p-3 bg-white/30 backdrop-blur-md shadow-md rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 placeholder-transparent [&>*]:outline-none [&.PhoneInputInput]:outline-none [&.PhoneInputInput]:border-none"
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReferralPage;