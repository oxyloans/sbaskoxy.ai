import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header3";
import Footer from "../components/Footer";
import Sidebar from "./Sidebarrice";

const WriteToUs: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here
    alert("Query submitted successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <Header />

     {/* Main Content */}
 <div className="p-6 flex">
        {/* Sidebar */}
        <Sidebar />


        {/* Write to Us Section */}
        <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-purple-700">Write a Query</h1>
            <button
              onClick={() => navigate("/tickethistory")}
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
            >
              Ticket History
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-2 border rounded-lg w-full"
                defaultValue="Gopal M"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 border rounded-lg w-full"
                defaultValue="gopalm@gmail.com"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="px-4 py-2 border rounded-lg w-full"
                defaultValue="8885345509"
              />
              <input
                type="file"
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>
            <textarea
              placeholder="Enter Your Query"
              className="px-4 py-2 border rounded-lg w-full h-32"
            ></textarea>
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg w-full md:w-auto hover:bg-purple-800 transition-colors"
            >
              Submit
            </button>
          </form>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WriteToUs;
