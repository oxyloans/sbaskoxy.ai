import React, { useState } from 'react';
import { 
  ShoppingBag,
  BookOpen,
  BarChart2,
  GraduationCap,
  Users,
  UserCheck,
  Coins,
  Bot,
  Settings
} from 'lucide-react';
import Header from "../kart/Header3";
import RudrakshaImage from "../assets/img/WEBSITE (1).png";

interface DashboardItem {
  title: string;
  image: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const DashboardMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('services');
  const [cartCount, setCartCount] = useState<number>(0);

  const handleNavigation = (path: string): void => {
    window.location.href = path;
  };

  const services: DashboardItem[] = [
    {
      title: 'Free Rudraksha',
     image: RudrakshaImage,
      description: 'Spiritual and wellness services',
      path: '/services/freerudraksha',
      icon: <ShoppingBag color="#7c3aed" size={24} />
    },
    {
      title: 'Free AI & GEN AI Training',
      image: '/api/placeholder/400/320',
      description: 'First Job - Professional AI Training',
      path: '/services/ai-training',
      icon: <BookOpen color="#7c3aed" size={24} />
    },
    {
      title: 'Legal Services',
      image: '/api/placeholder/400/320',
      description: 'Lawyers & Advocates',
      path: '/services/legal',
      icon: <BarChart2 color="#7c3aed" size={24} />
    },
    {
      title: 'Study Abroad',
      image: '/api/placeholder/400/320',
      description: 'International Education Consultancy',
      path: '/services/study-abroad',
      icon: <GraduationCap color="#7c3aed" size={24} />
    },
    {
      title: 'My Rotary',
      image: '/api/placeholder/400/320',
      description: 'Community International',
      path: '/services/rotary',
      icon: <Users color="#7c3aed" size={24} />
    },
    {
      title: 'We are hiring',
      image: '/api/placeholder/400/320',
      description: 'Join our growing team',
      path: '/careers',
      icon: <UserCheck color="#7c3aed" size={24} />
    }
  ];

  const products: DashboardItem[] = [
    {
      title: 'Product 1',
      image: '/api/placeholder/400/320',
      description: 'Product description',
      path: '/products/1',
      icon: <ShoppingBag color="#7c3aed" size={24} />
    }
  ];

  const freeGPTs: DashboardItem[] = [
    {
      title: 'GPT Service 1',
      image: '/api/placeholder/400/320',
      description: 'AI Assistant',
      path: '/gpts/1',
      icon: <Bot color="#7c3aed" size={24} />
    }
  ];

  const bmvCoin: DashboardItem[] = [
    {
      title: 'BMV Coin Service',
      image: '/api/placeholder/400/320',
      description: 'Cryptocurrency Service',
      path: '/bmvcoin/service',
      icon: <Coins color="#7c3aed" size={24} />
    }
  ];

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

  const renderItems = (items: DashboardItem[]): JSX.Element => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-4">
  {items.map((item: DashboardItem, index: number) => (
    <div 
      key={index}
      onClick={() => handleNavigation(item.path)}
      className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative h-36 sm:h-40">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-purple-50 rounded-lg">
            {item.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {item.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {item.description}
        </p>
        <button className="mt-3 w-full py-2 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm">
          Learn More
        </button>
      </div>
    </div>
  ))}
</div>

  );

  return (
    <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} />
      <div className="max-w-7xl mx-auto py-8">
        {/* Centered Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-col items-center">
            
            <div className="flex flex-wrap justify-center gap-4 p-2">
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
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {activeTab === 'services' && renderItems(services)}
          {activeTab === 'products' && renderItems(products)}
          {activeTab === 'freegpts' && renderItems(freeGPTs)}
          {activeTab === 'bmvcoin' && renderItems(bmvCoin)}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;