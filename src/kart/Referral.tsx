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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Footer from '../components/Footer';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import { Modal } from 'antd';
import { Navigate } from 'react-router-dom';

interface RefereeDetail {
  id: string;
  whatsappnumber: string;
  firstName: string | null;
  lastName: string | null;
  referenceStatus: string;
  referee: string;
  referredDate?: string;
}

interface Stats {
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
}

const ReferralPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareAction, setShareAction] = useState<'whatsapp' | 'copy' | null>(null);
  const [refereeDetails, setRefereeDetails] = useState<RefereeDetail[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
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
    }
  }, [token]);

  const fetchRefereeDetails = async () => {
    try {
      const response = await axios.get<RefereeDetail[]>(
        `https://meta.oxyglobal.tech/api/reference-service/getreferencedetails/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const detailsWithDate = response.data.map((detail: RefereeDetail) => ({
        ...detail,
        referredDate: new Date().toLocaleDateString()
      }));

      setRefereeDetails(detailsWithDate);
      
      const total = detailsWithDate.length;
      const active = detailsWithDate.filter(d => d.referenceStatus ==="REGISTERED").length;
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
    // setShareAction(action);
    setPhoneNumber(undefined);
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
    const response =  await axios.post(
        'https://meta.oxyglobal.tech/api/user-service/inviteaUser',
        {
          referealId: customerId,
          refereeMobileNumber: phoneNumber
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
        content: response.data.message,
        onOk: () => {
          
        },
      })
    } catch (error) {
      console.error('Error inviting user:', error);
      if(error){
      Modal.error({
        content: 'An invitation has already been sent to this user.',
        onOk: () => {

        },
      })
    }else{
      setError('Failed to invite user. Please try again.');
    }
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
    <div className="bg-white rounded-xl shadow-sm p-6">
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
          <div className="bg-white rounded-xl shadow-sm p-6">
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
                        <td className="border-b p-4 text-gray-600">{referee.referredDate || 'N/A'}</td>
                        <td className="border-b p-4">
                          <span 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              referee.referenceStatus 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {referee.referenceStatus }
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
        onChange={setPhoneNumber}
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