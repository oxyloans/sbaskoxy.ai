import React from "react";
import coinImage from "../assets/img/BMVCOIN1.png"; // Update with your actual image path

const BMVCoinPromo = () => {
  return (
    <section className="relative py-16 px-8 md:py-20 md:px-16 bg-gradient-to-r from-blue-900 via-purple-700 to-purple-500 text-white flex flex-col-reverse md:flex-row items-center justify-between overflow-hidden rounded-sm shadow-2xl">
      {/* Content Section */}
      <div className="w-full md:w-1/2 text-center md:text-left animate-fade-in">
        <h2 className="text-xl sm:text-xl md:text-2xl font-extrabold leading-snug mb-6">
          Get <span className="text-yellow-400">10,000 BMVCOINS</span> Free
          Today!
        </h2>
        <p className="text-sm sm:text-xl md:text-xl lg:text-2xl mb-4 font-light">
          Claim your{" "}
          <span className="text-yellow-400 font-semibold">10,000 BMVCOINS</span>{" "}
          now! These coins have massive growth potential:
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
          Future Value Estimates
        </p>
        <ul className="text-lg sm:text-xl md:text-2xl space-y-4 mb-8">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✔</span> Minimum: ₹10,000
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✔</span> Maximum: ₹1,00,000
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✔</span> Great Value: ₹8,00,000+
          </li>
        </ul>
        <button className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-110 shadow-2xl text-lg md:text-xl">
          🚀 Claim Your Coins Now
        </button>
      </div>

      {/* Coin Image Section */}
      <div className="hidden sm:flex w-full md:w-1/2 justify-center mb-6 md:mb-0 ">
        <div className="relative flex flex-col items-center">
          <img
            src={coinImage}
            alt="BMV Coin"
            className="w-32 sm:w-40 md:w-48 lg:w-56 opacity-90 rounded-full shadow-2xl "
          />
          <img
            src={coinImage}
            alt="BMV Coin Reflection"
            className="w-32 sm:w-40 md:w-48 lg:w-56 opacity-30 transform scale-y-[-1] -mt-6 rounded-full shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default BMVCoinPromo;
