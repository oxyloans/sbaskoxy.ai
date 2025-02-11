import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag,
    Coins,
    Bot,
    Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Image1 from "../assets/img/WEBSITE (1).png";
import Image2 from "../assets/img/R2.png";
import Header from "../kart/Header3";

const FreeRudrakshaPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [modalType, setModalType] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('services');
  const [query, setQuery] = useState('');
  const [isWriteToUsOpen, setIsWriteToUsOpen] = useState(false);

  const userId = localStorage.getItem('userId');
  const email = localStorage.getItem('email');
  const whatsappNumber = localStorage.getItem('whatsappNumber');

   const TabButton = ({ tab, icon, label }: { tab: string; icon: React.ReactNode; label: string }) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === tab 
            ? 'bg-purple-100 text-purple-700 shadow-sm' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        {icon}
        {label}
      </button>
    );

  // Other services
  const otherServices = [
    "Free AI & CHATGPT Training",
    "Legal Knowledge Hub",
    "My Rotary",
    "Study Abroad",
    "Free Rice Samples",
    "Machines and Manufacturing Services"
  ];

  const handleFreeRudrakshaClick = () => {
    if (!whatsappNumber) {
      navigate('/dashboard/user-profile');
      return;
    }
    setModalType('confirmation');
    setIsModalOpen(true);
  };

  const handleAddressSubmit = async () => {
    if (!address.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch('https://meta.oxygloabal.tech/api/auth-service/auth/rudhrakshaDistribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, userId }),
      });

      if (response.ok) {
        setModalType('success');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} />
      {/* Top Navigation */}
      <div className="flex flex-wrap justify-center gap-4 p-2 py-8">
              <TabButton 
                tab="services" 
                icon={<Settings size={20} color={activeTab === 'services' ? "#7c3aed" : "#64748b"} />} 
                label="Services" 
              />
              <TabButton 
                tab="products" 
                icon={<ShoppingBag size={20} color={activeTab === 'products' ? "#7c3aed" : "#64748b"} />} 
                label="Products" 
              />
              <TabButton 
                tab="freegpts" 
                icon={<Bot size={20} color={activeTab === 'freegpts' ? "#7c3aed" : "#64748b"} />} 
                label="FreeGPTs" 
              />
              <TabButton 
                tab="bmvcoin" 
                icon={<Coins size={20} color={activeTab === 'bmvcoin' ? "#7c3aed" : "#64748b"} />} 
                label="BMVCOIN" 
              />
            </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-purple-600">Free Rudraksha</h1>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="relative">
            <img 
            src={Image1}
              alt="Spiritual World"
              className="w-full h-75 object-cover rounded-lg"
            />
            <h3 className="text-xl text-center mt-4 text-purple-600 font-semibold">Spiritual World</h3>
          </div>
          <div className="relative">
            <img 
              src={Image2}
              alt="AI & Generative AI World"
              className="w-full h-75 object-cover rounded-lg"
            />
            <h3 className="text-xl text-center mt-4 text-purple-600 font-semibold">AI & Generative AI World</h3>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center space-y-6 mb-8">
          <p className="text-lg">
            The One Lakh Rudrakshararchana on 19th November was a grand success! ⭐
          </p>
          <p className="text-lg">
            Click on "I Want Free Rudraksha" now to receive the sacred Rudrakshas used in the Archana. 
            They will be delivered to your doorstep at no cost. Inspired by this success, 
            we aspire to host 99 more Rudrakshararchana events to fulfill our vision of 
            One Crore Rudrakshararchanas! Join us on this divine journey. 🙏
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleFreeRudrakshaClick}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              I Want Free Rudraksha
            </button>
            <button
              onClick={() => setIsWriteToUsOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Write To Us
            </button>
          </div>
        </div>

        {/* Telugu Content */}
        <div className="text-center mb-8">
          <p className="text-lg mb-4">
            నవంబర్ 19న నిర్వహించిన లక్ష రుద్రాక్షార్చన ఘన విజయాన్ని సాధించింది! ⭐
          </p>
          <p className="text-lg">
            ఆర్చనలో ఉపయోగించిన పవిత్ర రుద్రాక్షలను ఉచితంగానికి ఇప్పుడు "I want Free Rudraksha" పై క్లిక్ చేయండి.
            అవి మీ ఇంటి వద్దకు ఉచితంగా పంపబడతాయి. ఈ విజయంతో ప్రేరణ పొందిన మేము, మా లక్ష్యం
            అయిన కోటి రుద్రాక్షార్చనల సాధన కోసం మరో 99 రుద్రాక్షార్చన కార్యక్రమాలను నిర్వహించటానికి సంకల్పించాము!
            ఈ దివ్య ప్రయాణంలో భాగస్వాములం అవ్వండి. 🙏
          </p>
        </div>

        {/* Other Services Sidebar */}
        <div className="bg-green-700 rounded-t-lg p-4">
          <h2 className="text-xl text-white font-semibold mb-4">Other Services</h2>
          <div className="space-y-3">
            {otherServices.map((service, index) => (
              <div key={index} className="text-white hover:bg-green-600 p-2 rounded cursor-pointer">
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(isModalOpen || isWriteToUsOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {/* ... (rest of the modal code remains the same) ... */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeRudrakshaPage;