// import React from "react";
// import coinImage from "../../assets/img/DALL·E 2025-02-03 22.30.10 - A logo design featuring the letters 'BMV' in a modern and sleek style, using bold and clear fonts. The logo should be in a vibrant yellow color, with .png"; // Update with your coin image asset

// const BMVCoinPromo = () => {
//   return (
//     <section className="relative py-12 px-6 md:py-16 md:px-14 bg-gradient-to-r from-blue-900 via-purple-700 to-purple-400 text-white overflow-hidden">
//       {/* Absolutely positioned coin image on the right side, hidden on mobile */}
//       <div className="absolute hidden md:block right-6 top-1/3 transform -translate-y-1/2 md:right-14 md:top-1/2 flex flex-col items-center pointer-events-none">
//         <img
//           src={coinImage}
//           alt="BMV Coin"
//           className="w-24 md:w-40 opacity-90 rounded-full animate__animated animate__fadeInRight animate__delay-1s"
//         />
//         <img
//           src={coinImage}
//           alt="BMV Coin Reflection"
//           className="w-24 md:w-40 opacity-30 transform scale-y-[-1] -mt-4 rounded-full animate__animated animate__fadeInRight animate__delay-1s"
//         />
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
//         {/* Left side: Text content */}
//         <div className="w-full md:w-1/2 text-left">
//           <h2 className="text-2xl md:text-3xl font-bold mb-4">
//             FREE <span className="text-yellow-400">10,000 BMVCOINS</span> Today!
//           </h2>
//           <p className="text-base md:text-lg mb-6">
//             We are giving away{" "}
//             <span className="text-yellow-400 font-semibold">
//               10,000 BMVCOINS
//             </span>{" "}
//             to every user absolutely free! But that's not all—these coins come
//             with game-changing potential:
//           </p>
//           <p className="text-lg md:text-xl font-semibold mb-6">
//             <span className="block">Future Value Estimates</span>
//             <span className="block">
//               Minimum: ₹10,000 || Maximum: ₹1,00,000
//             </span>
//             <span className="block">Great Value: ₹8,00,000+</span>
//           </p>
//           <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
//             Claim Your Coins
//           </button>
//         </div>

//         {/* Right side: Placeholder for coin image */}
//         {/* This side is hidden on mobile (md:block), but will show the coin image on tablet and larger screens */}
//         <div className="hidden md:block md:w-1/2"></div>
//       </div>
//     </section>
//   );
// };

// export default BMVCoinPromo;




import React from "react";
import coinImage from "../assets/img/DALL·E 2025-02-03 22.30.10 - A logo design featuring the letters 'BMV' in a modern and sleek style, using bold and clear fonts. The logo should be in a vibrant yellow color, with  (1).png"; // Update with your coin image asset

const BMVCoinPromo = () => {
  return (
    <section className="relative py-12 px-6 md:py-16 md:px-10 bg-gradient-to-r from-blue-900 via-purple-700 to-purple-400 text-white overflow-hidden flex flex-col items-center md:flex-row">
      {/* Coin Image - Visible on larger screens */}
      <div className="hidden md:flex md:w-1/2 justify-center">
        <div className="relative flex flex-col items-center">
          <img
            src={coinImage}
            alt="BMV Coin"
            className="w-20 sm:w-28 md:w-36 lg:w-40 opacity-90 rounded-full animate__animated animate__fadeInRight"
          />
          <img
            src={coinImage}
            alt="BMV Coin Reflection"
            className="w-20 sm:w-28 md:w-36 lg:w-40 opacity-30 transform scale-y-[-1] -mt-4 rounded-full animate__animated animate__fadeInRight"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-6 md:mt-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          FREE <span className="text-yellow-400">10,000 BMVCOINS</span> Today!
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4">
          We are giving away{" "}
          <span className="text-yellow-400 font-semibold">10,000 BMVCOINS</span>{" "}
          to every user absolutely free! But that's not all—these coins come
          with game-changing potential:
        </p>
        <p className="text-base sm:text-lg md:text-xl font-semibold mb-6">
          <span className="block">Future Value Estimates</span>
          <span className="block">Minimum: ₹10,000 || Maximum: ₹1,00,000</span>
          <span className="block">Great Value: ₹8,00,000+</span>
        </p>
        <button className="px-5 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
          Claim Your Coins
        </button>
      </div>
    </section>
  );
};

export default BMVCoinPromo;
