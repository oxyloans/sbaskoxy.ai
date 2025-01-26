import React, { useState } from "react";
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";
import { useNavigate } from 'react-router-dom';

type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  duration: string; // e.g., "1 Month", "1 Year"
  benefits: string[];
};

const Subscription: React.FC = () => {
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "₹500.00",
      duration: "1 Month",
      benefits: ["Access to basic features", "Limited support"],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹2000.00",
      duration: "6 Months",
      benefits: [
        "Access to all features",
        "Priority support",
        "Exclusive discounts",
      ],
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹3500.00",
      duration: "1 Year",
      benefits: [
        "All Premium benefits",
        "Free delivery on all orders",
        "Dedicated account manager",
      ],
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // Logic to handle subscription payment or confirmation
    alert(`You have selected the ${planId} plan!`);
  };


  const activeSubscription = true;
  const navigate = useNavigate();


  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="p-6 flex">
        {/* Sidebar */}
        <Sidebar />


       {/* Orders Section */}
       <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">

          <div className="space-y-4">
          {/* Page Header */}
          <header className="bg-white shadow-md p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Subscription Plans
            </h1>
            <p className="text-sm text-gray-600">
              Choose a subscription plan that suits your needs.
            </p>
          </header>

          <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
            {activeSubscription && (
              <p className="text-xs md:text-sm text-red-600 font-bold">
                Note: You already have an active subscription. Complete the current subscription before subscribing to a new one.
              </p>
            )}
          </div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                  selectedPlan === plan.id ? "border-2 border-blue-500" : ""
                }`}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h2>
                <p className="text-lg text-gray-600 font-semibold mb-4">
                  {plan.price} / {plan.duration}
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600">
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-2 px-4 text-white rounded-md ${
                    selectedPlan === plan.id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors`}
                >
                  {selectedPlan === plan.id ? "Subscribed" : "Subscribe"}
                </button>
              </div>
            ))}
        </div>
        </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Subscription;
