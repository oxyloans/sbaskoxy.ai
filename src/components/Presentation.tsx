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
    <div className="bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-2">
          Our Presentations
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          Discover our vision and initiatives in these concise presentations.
        </p>
      </div>

      {/* Presentation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {[
          {
            title: "Unstoppable Pink Funding",
            image: PinkFound,
            link: "https://drive.google.com/file/d/10hTZ7kTcbe8vhBG4eFKhuq2OE4eitW4J/preview",
          },
          {
            title: "OXY GROUP Presentation",
            image: OxyGroup,
            link: "https://drive.google.com/file/d/1mUSySGlKGdASB2EaXsr_4gUClluG4LTo/preview",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm"
            onClick={() => openPdfModal(item.link)}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 sm:h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-medium text-sm sm:text-base bg-black bg-opacity-60 px-3 py-1 rounded-md">
                View
              </span>
            </div>
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-3">
              <h3 className="text-white font-semibold text-sm sm:text-base">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for PDF Viewer */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-3xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              Presentation Preview
            </h3>
            <div className="w-full h-96 border rounded-md overflow-hidden">
              <iframe
                src={selectedPdf ?? ""}
                title="PDF Viewer"
                width="100%"
                height="100%"
                className="rounded-md"
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
