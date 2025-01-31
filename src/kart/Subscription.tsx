import React, { useState } from "react";
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { Menu, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';

// Custom Alert Component
const Alert: React.FC<{
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'default', children, className = '' }) => {
  const baseStyles = "rounded-lg p-4 flex items-start gap-3";
  const variantStyles = variant === 'destructive'
    ? 'bg-red-50 text-red-700'
    : 'bg-blue-50 text-blue-700';

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="text-sm font-medium">{children}</div>
);

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  benefits: string[];
  popular?: boolean;
};

const Subscription: React.FC = () => {
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "₹500.00",
      duration: "1 Month",
      benefits: [
        "Access to basic features",
        "Email support response within 24 hours",
        "Basic analytics dashboard",
        "Up to 3 user accounts"
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹2000.00",
      duration: "6 Months",
      benefits: [
        "Access to all features",
        "Priority support with 4-hour response",
        "Advanced analytics and reporting",
        "Up to 10 user accounts",
        "Exclusive member discounts",
        "Monthly strategy consultation"
      ],
      popular: true,
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹3500.00",
      duration: "1 Year",
      benefits: [
        "All Premium benefits",
        "Instant priority support 24/7",
        "Custom analytics solutions",
        "Unlimited user accounts",
        "Free delivery on all orders",
        "Dedicated account manager",
        "Quarterly business review"
      ],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const activeSubscription = true;
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    const element = document.getElementById(planId);
    element?.classList.add('scale-105');
    setTimeout(() => {
      element?.classList.remove('scale-105');
    }, 200);
    alert(`You have selected the ${planId} plan!`);
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
              {/* Page Header */}
              <div className="text-center max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                  Choose Your Perfect Plan
                </h1>
                <p className="text-lg text-gray-600">
                  Select a subscription that best fits your needs. Upgrade or downgrade at any time.
                </p>
              </div>

              {/* Content Container */}
              <div className="bg-white rounded-xl shadow-sm mb-4">
                {/* Active Subscription Alert */}
                {activeSubscription && (
                  <Alert variant="destructive" className="mb-8">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <AlertDescription>
                      You have an active subscription. Please complete your current subscription before selecting a new plan.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Subscription Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <div
                      id={plan.id}
                      key={plan.id}
                      className={`relative rounded-xl border ${plan.popular ? 'border-purple-400 shadow-purple-100' : 'border-gray-200'
                        } bg-white shadow-md transition-all duration-300 hover:shadow-lg flex flex-col h-full`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white text-center">
                          Most Popular
                        </div>
                      )}

                      <div className="p-5 flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-6">
                          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 mt-auto">
                        <button
                          onClick={() => handleSubscribe(plan.id)}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors 
            ${selectedPlan === plan.id ? 'bg-purple-700 text-white hover:bg-purple-800'
                              : plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
                          {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>


                {/* Additional Features Section */}
                <div className="mt-12 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">All Plans Include</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: "30-Day Money Back", description: "Try risk-free with our guarantee" },
                      { title: "24/7 System Status", description: "Check our uptime anytime" },
                      { title: "Regular Updates", description: "Stay current with latest features" }
                    ].map((feature, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Subscription;