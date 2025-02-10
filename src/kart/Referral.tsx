import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaBriefcase, FaMapMarkerAlt, FaTrash, FaPen } from 'react-icons/fa';
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Link as LinkIcon, 
  AlertCircle, 
  X 
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Header from './Header3';
import Footer from '../components/Footer';
import Sidebar from './Sidebarrice';
import axios from 'axios';

interface RefereeDetail {
  id: string;
  whatsappnumber: string;
  firstName: string | null;
  lastName: string | null;
  status: boolean;
  referee: string;
  referredDate?: string;
}

const ReferralPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [copyLoad, setCopyLoad] = useState<boolean>(false);
  const [isValidationPopupOpen, setIsValidationPopupOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [refereeDetails, setRefereeDetails] = useState<RefereeDetail[]>([]);
  
  const [formData, setFormData] = useState({
    friendName: '',
    friendMobile: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const customerId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching referee details:', error);
      }
    };

    if (token) {
      fetchRefereeDetails();
    }
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
  }, [token]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.friendName.trim()) {
      errors.friendName = 'Friend\'s name is required';
    }
    
    if (!formData.friendMobile.trim()) {
      errors.friendMobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.friendMobile)) {
      errors.friendMobile = 'Please enter a valid 10-digit mobile number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const shareReferral = (inviteLink: string) => {
    const shareText = `Hey! I'm inviting you to join Oxy. Use my referral link to sign up: ${inviteLink}`;

    return {
      whatsapp: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      },
      sms: () => {
        const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;
        window.open(smsUrl, '_blank');
      },
      copy: () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
          alert('Referral link copied!');
        });
      }
    };
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Referral Program</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Referral Link</h3>
                  <div className="flex items-center bg-purple-50 rounded-lg p-3">
                    <LinkIcon className="mr-3 text-purple-600" />
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://www.askoxy.ai/whatsappregister?ref=${customerId}`}
                      className="flex-1 bg-transparent focus:outline-none"
                    />
                    <button 
                      onClick={() => shareReferral(`https://www.askoxy.ai/whatsappregister?ref=${customerId}`).copy()}
                      className="ml-2 p-2 hover:bg-purple-100 rounded-full"
                    >
                      <Copy className="text-purple-600" />
                    </button>
                  </div>
                </div>

                {/* Invite Form Code */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Invite a Friend</h3>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => shareReferral(`https://www.askoxy.ai/whatsappregister?ref=${customerId}`).whatsapp()}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center"
                      >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                      </button>
                      <button 
                        onClick={() => shareReferral(`https://www.askoxy.ai/whatsappregister?ref=${customerId}`).sms()}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center"
                      >
                        <MessageCircle className="mr-2" /> SMS
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Referee Details Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Your Referee Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-purple-50">
                        <th className="border p-3 text-left">WhatsApp Number</th>
                        {/* <th className="border p-3 text-left">Name</th> */}
                        <th className="border p-3 text-left">Referred Date</th>
                        <th className="border p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refereeDetails.map((referee: RefereeDetail) => (
                        <tr key={referee.id} className="hover:bg-gray-50">
                          <td className="border p-3">{referee.whatsappnumber}</td>
                          {/* <td className="border p-3">
                            {referee.firstName || referee.lastName 
                              ? `${referee.firstName || ''} ${referee.lastName || ''}`.trim() 
                              : 'N/A'}
                          </td> */}
                          <td className="border p-3">{referee.referredDate || 'N/A'}</td>
                          <td className="border p-3">
                            <span 
                              className={`px-2 py-1 rounded ${
                                referee.status 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {referee.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {refereeDetails.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">
                      No referee details found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Validation Popup remains the same */}
      {isValidationPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={24} className="text-red-600" />
                <h2 className="text-lg font-semibold">Validation Error</h2>
              </div>
              <button 
                onClick={() => setIsValidationPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Please fill in all required fields:</p>
              <ul className="space-y-1">
                {Object.entries(validationErrors).map(([field, error]) => (
                  <li key={field} className="flex items-center gap-2 text-red-600">
                    <span>•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setIsValidationPopupOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

 <Footer />
    </div>
  );
};

export default ReferralPage;