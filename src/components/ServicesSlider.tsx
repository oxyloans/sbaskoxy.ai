import React, { useState } from "react";
import logo1 from "../assets/img/WEBSITE (1).png";
import logo2 from "../assets/img/freesample.jpg";
import logo3 from "../assets/img/freeaiandgenai.png";
import logo4 from "../assets/img/legal.png";
import { useNavigate } from "react-router-dom";

const ServicesSlider: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent] = useState(
    "We are simply showcasing these services for you. Please refrain from registering or accessing them at this moment."
  );

  const services = [
    { image: logo1, title: "Free Rudraksha" },
    { image: logo3, title: "Free AI & GEN AI Training" },
    { image: logo4, title: "Legal Knowledge Hub" },
    { image: logo2, title: "Free Rice Samples & Steel Container" },
    { image: logo2, title: "Study Abroad" },
    { image: logo3, title: "My Rotary" },
    { image: logo1, title: "Machines Manufacturing Services" },
    { image: logo2, title: "Career Guidance" },
    { image: logo3, title: "Business Growth" },
  ];

  const navigate = useNavigate();
  const displayedServices = showAll ? services : services.slice(0, 3);

  const handleImageClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-purple-50 min-h-[50vh] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left mb-4 sm:mb-0">
          <span className="text-[#3c1973]">Our</span>{" "}
          <span className="text-yellow-500">Services</span>
          <span className="block w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mt-2 mx-auto sm:mx-0"></span>
        </h2>
        <button
          className="bg-[#1e3a8a] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#1e3a8a] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowAll(!showAll)}
          aria-label={showAll ? "Show fewer services" : "Show all services"}
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        {displayedServices.map((service, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center p-4 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleImageClick()}
            aria-label={`Learn more about ${service.title}`}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0"></div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-center p-3 text-base font-semibold">
                {service.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 sm:scale-105">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
              Service Information
            </h3>
            <p className="text-center text-base sm:text-lg text-gray-600 mb-6">
              {modalContent}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleLoginClick}
                aria-label="Sign In"
              >
                Sign In
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={closeModal}
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSlider;
