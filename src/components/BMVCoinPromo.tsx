import React, { useState, useEffect } from "react";
import coinImage from "../assets/img/BMVCOIN1.png";

const BMVCoinPromo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className={`relative py-6 px-4 sm:py-10 sm:px-6 md:py-12 lg:py-16 bg-gradient-to-b from-amber-50 to-amber-100 text-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Classic subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px 20px' }}></div>
      </div>
      
    

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Content Section with Classic Styling */}
        <div className="w-full lg:w-3/5 text-center lg:text-left">
          <div className="bg-amber-50 p-5 sm:p-6 rounded-md shadow-md border border-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div className="flex items-center justify-center sm:justify-start mb-3 sm:mb-0">
                <span className="inline-block px-3 py-1 bg-amber-800 text-amber-50 text-sm font-serif rounded">
                  EXCLUSIVE OFFER
                </span>
              </div>
              
              
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif mb-3 leading-tight text-amber-900">
              Get <span className="text-amber-800 border-b-2 border-amber-300">10,000 BMVCOINS</span> Free Today!
            </h2>
            
            <p className="text-base sm:text-lg mb-5 font-light text-amber-900">
              Claim your <span className="text-amber-800 font-medium">10,000 BMVCOINS</span> now 
              and join thousands already benefiting from this time-tested digital currency.
            </p>
            
            <div className="bg-white p-4 sm:p-5 rounded-md mb-5 border border-amber-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-serif mb-3 text-center text-amber-900">
                <span className="inline-block border-b border-amber-300 pb-1">Future Value Projections</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-amber-800 font-serif text-sm">Minimum</p>
                  <p className="text-xl font-medium text-amber-900">₹10,000</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-amber-800 font-serif text-sm">Maximum</p>
                  <p className="text-xl font-medium text-amber-900">₹1,00,000</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-amber-800 font-serif text-sm">Great Value</p>
                  <p className="text-xl font-medium text-amber-900">₹8,00,000+</p>
                </div>
              </div>
            </div>
            
            <button className="w-full px-5 py-3 bg-amber-800 text-amber-50 font-medium rounded-md hover:bg-amber-700 transition-colors duration-300 text-base flex items-center justify-center gap-2">
              <span>🔶</span> Claim Your Coins Now
            </button>
          </div>
        </div>
        
        {/* Coin Image Section - Classic Style */}
        <div className="w-full lg:w-2/5 flex justify-center pt-4 lg:pt-0">
          <div className="relative">
            {/* Gold/amber glow effect */}
            <div className="absolute inset-0 w-full h-full rounded-full bg-amber-300 opacity-30 filter blur-xl"></div>
            
            {/* Main coin with subtle animation */}
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-amber-200 to-amber-50 rounded-full shadow-lg">
                <img
                  src={coinImage}
                  alt="BMV Coin"
                  className="w-40 sm:w-48 md:w-52 rounded-full border-4 border-amber-100"
                />
              </div>
              
              {/* Classic coin embellishments */}
              <div className="absolute inset-0 -m-2 border-2 border-amber-600 border-opacity-20 rounded-full animate-pulse"></div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-2 w-10 h-10 bg-white p-1 rounded-full shadow-md border border-amber-200">
                <img src={coinImage} alt="Mini coin" className="w-full h-full rounded-full" />
              </div>
              <div className="absolute -bottom-2 -left-6 w-12 h-12 bg-white p-1 rounded-full shadow-md border border-amber-200">
                <img src={coinImage} alt="Mini coin" className="w-full h-full rounded-full" />
              </div>
            </div>
            
            {/* Classic reflection effect */}
            <div className="absolute -bottom-12 left-0 right-0 flex justify-center opacity-30">
              <div className="w-32 h-8 bg-amber-700 rounded-full filter blur-md transform scale-x-125"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust indicators with classic styling */}
      <div className="relative z-10 mt-6 pt-4 border-t border-amber-300 border-opacity-50">
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
          <div className="flex flex-col items-center p-2">
            <svg className="w-5 h-5 mb-1 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-amber-900 font-serif">Secure Blockchain</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <svg className="w-5 h-5 mb-1 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-amber-900 font-serif">Instant Delivery</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <svg className="w-5 h-5 mb-1 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-amber-900 font-serif">Zero Fees</span>
          </div>
        </div>
        

        
      </div>
    </section>
  );
};

export default BMVCoinPromo;