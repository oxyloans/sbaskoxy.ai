import React, { useState } from "react";
import logo1 from "../assets/img/WEBSITE (1).png";
import logo2 from "../assets/img/freesample.jpg";
import logo3 from "../assets/img/freeaiandgenai.png";
import { useNavigate } from "react-router-dom";

const ServicesSlider: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(
    "We are simply showcasing these services for you. Please refrain from registering or accessing them at this moment."
  );

  const services = [
    { image: logo1, title: "Free Rudraksha" },
    { image: logo2, title: "Free AI & GEN AI Training" },
    { image: logo3, title: "Legal Services" },
    { image: logo1, title: "Financial Consulting" },
    { image: logo2, title: "Educational Support" },
    { image: logo3, title: "Health & Wellness" },
    { image: logo1, title: "Tech Assistance" },
    { image: logo2, title: "Career Guidance" },
    { image: logo3, title: "Business Growth" },
  ];

  const navigate = useNavigate();

  const handleImageClick = () => {
    setModalContent(
      "We are simply showcasing these services for you. Please refrain from registering or accessing them at this moment."
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLoginClick = () => {
    closeModal();
    navigate("/whatsapplogin"); // Navigate to the login page
  };

  const displayedServices = showAll ? services : services.slice(0, 3);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center sm:text-left mb-4 sm:mb-0">
          <span className="text-[#3c1973]">Our</span>
          <span className="text-yellow-500"> Services</span>
          <span className="block w-16 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mt-2 mx-auto sm:mx-0"></span>
        </h2>

        <button
          className="text-white font-semibold bg-blue-600 px-4 py-2 rounded-lg transition hover:bg-blue-700"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show All"}
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedServices.map((service, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center p-4 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105 cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden group">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0"></div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white text-center p-2 text-lg font-semibold">
                {service.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Service Information
            </h3>
            <p className="text-center text-lg text-gray-600">{modalContent}</p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                onClick={handleLoginClick}
              >
                Sign In
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all duration-300"
                onClick={closeModal}
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
