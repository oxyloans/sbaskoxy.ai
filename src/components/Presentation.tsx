import React, { useState } from "react";
import OxyGroup from "../assets/img/oxy group.png";
import PinkFound from "../assets/img/womenempower.png";

const PdfPages = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPdfModal = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPdf(null);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 flex flex-col items-center justify-center px-6 py-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-indigo-800 mb-4">
          Explore Our Presentations
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Gain insights into our corporate vision and initiatives. Click on a
          presentation to view it in detail.
        </p>
      </div>

      {/* Presentation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full max-w-5xl">
        {[
          {
            title: "Unstoppable Pink Funding",
            image: PinkFound,
            link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview",
          },
          {
            title: "OXY GROUP Corporate Presentation",
            image: OxyGroup,
            link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/preview",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative group cursor-pointer rounded-xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => openPdfModal(item.link)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-semibold text-lg bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                View Presentation
              </span>
            </div>
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full p-4">
              <h3 className="text-white font-bold text-xl">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for PDF Viewer */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full relative transform transition-all duration-300">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              PDF Viewer
            </h3>
            <div className="w-full h-[500px] border rounded-lg shadow-md overflow-hidden">
              <iframe
                src={selectedPdf ?? ""}
                title="PDF Viewer"
                width="100%"
                height="100%"
                className="rounded-lg"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPages;
