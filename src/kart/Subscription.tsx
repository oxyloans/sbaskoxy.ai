import React, { useEffect, useState } from "react";
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { Menu, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Types
type SubscriptionPlan = {
  amount: number;
  getAmount: number;
  limitAmount: number;
  planId: string;
  status: boolean;
};

interface AlertProps {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
}

// Components
const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const baseStyles = "rounded-lg p-4 flex items-start gap-3 shadow-sm";
  const variantStyles = variant === 'destructive'
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-blue-50 text-blue-700 border border-blue-200';

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => (
  <div className="text-sm font-medium">{children}</div>
);

const SubscriptionCard: React.FC<{
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSubscribe: (planId: string) => void;
}> = ({ plan, isSelected, onSubscribe }) => (
  <div
    id={plan.planId}
    className={`relative rounded-xl border ${
      isSelected 
        ? 'border-purple-600 ring-2 ring-purple-600 ring-opacity-50' 
        : plan.status 
          ? 'border-purple-400 shadow-purple-100' 
          : 'border-gray-200'
    } bg-white shadow-lg transition-all duration-300 hover:shadow-xl flex flex-col h-full transform hover:-translate-y-1`}
  >
    {plan.status && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
          Most Popular
        </span>
      </div>
    )}

    <div className="p-6 flex-grow">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            ₹{plan.amount.toLocaleString()}
          </h2>
          <p className="text-lg font-medium text-purple-600">
          Wallet Balance:₹{plan.getAmount.toLocaleString()}
          </p>
          <p className="text-gray-600">
          Monthly Usage Limit: ₹{plan.limitAmount.toLocaleString()}

          </p>
        </div>
      </div>
    </div>

    <div className="p-6 pt-0">
      <button
        onClick={() => onSubscribe(plan.planId)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 
          ${isSelected
            ? 'bg-purple-700 text-white hover:bg-purple-800 shadow-lg'
            : plan.status
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          } transform hover:scale-[1.02]`}
      >
        {isSelected ? 'Selected' : 'Choose Plan'}
      </button>
    </div>
  </div>
);

const FeatureCard: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => (
  <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="font-semibold text-gray-900 text-lg mb-2">
      {title}
    </h3>
    <p className="text-gray-600">
      {description}
    </p>
  </div>
);

const Subscription: React.FC = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeSubscription = true;
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    alert(`You have selected the ${planId} plan!`);
  };

  const getPlans = async () => {
    try {
      const response = await axios.get('https://meta.oxyglobal.tech/api/order-service/getAllPlans');
      setSubscriptionPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch subscription plans:', error);
    }
  };

  useEffect(() => {
    getPlans();
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Choose Your Perfect Plan
                </h1>
                <p className="text-lg text-gray-600">
                Subscribe & Save Upto ₹500 – Hassle-Free Fresh Rice Delivery!
                </p>
              </div>

              {/* {activeSubscription && (
                <Alert variant="destructive" className="mb-8">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <AlertDescription>
                    You have an active subscription. Please complete your current subscription before selecting a new plan.
                  </AlertDescription>
                </Alert>
              )} */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {subscriptionPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.planId}
                    plan={plan}
                    isSelected={selectedPlan === plan.planId}
                    onSubscribe={handleSubscribe}
                  />
                ))}
              </div>

              {/* <div className="mt-16 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  All Plans Include
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "30-Day Money Back",
                      description: "Try risk-free with our guarantee"
                    },
                    {
                      title: "24/7 System Status",
                      description: "Check our uptime anytime"
                    },
                    {
                      title: "Regular Updates",
                      description: "Stay current with latest features"
                    }
                  ].map((feature, index) => (
                    <FeatureCard
                      key={index}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
                </div>
              </div> */}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Subscription;