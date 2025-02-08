import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { notification } from "antd";

interface Image {
  imageId: string;
  imageUrl: string;
  status: boolean;
}

interface Campaign {
  campaignType: string;
  campaignDescription: string;
  imageUrls: Image[];
  campaignTypeAddBy: string;
  campaignStatus: boolean;
}

const CampaignDetails: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/"); // Split path into parts
  const campaignType = decodeURIComponent(pathParts[pathParts.length - 1]);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [formData, setFormData] = useState({
    askOxyOfers: "FREEAI",
    userId: userId,
    projectType: "ASKOXY",
  });

  // Fetch campaigns from the API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Campaign[]>(
          "https://meta.oxyglobal.tech/api/marketing-service/campgin/getAllCampaignDetails"
        );
        setCampaigns(response.data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const campaign = campaigns.find((c) => c.campaignType === campaignType);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        "http://182.18.139.138:9229/api/marketing-service/campgin/askOxyOfferes",
        formData
      );
      localStorage.setItem("askOxyOfers", response.data.askOxyOfers);
      notification.success({
        message: "Success!",
        description: `Your interest has been submitted successfully!`,
        placement: "top",
        duration: 2,
        style: {
          width: 300,
          fontSize: "14px",
          padding: "10px",
        },
      });
    } catch (error: any) {
      if (error.response?.status === 500 || error.response?.status === 400) {
        notification.warning({
          message: "Warning!",
          description: `You have already participated. Thank you!`,
          placement: "top",
          duration: 2,
          style: {
            width: 300,
            fontSize: "14px",
            padding: "10px",
          },
        });
      } else {
        console.error("API Error:", error);
        notification.error({
          message: "Error!",
          description: "Failed to submit your interest. Please try again.",
          duration: 2,
          placement: "top",
          style: {
            width: 300,
            fontSize: "14px",
            padding: "10px",
          },
        });
      }
      setIsButtonDisabled(false);
    }
  };

  const handleWriteToUs = () => {
    console.log("Write to us clicked");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
            <p className="mt-4 text-gray-600 text-center">
              Loading campaigns...
            </p>
          </div>
        </div>
      ) : !campaign ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl text-gray-600">Campaign not found</div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col mb-6 w-full">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
              {campaign.campaignType}
            </h1>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all"
                onClick={handleSubmit}
                aria-label="Visit our site"
                disabled={isButtonDisabled}
              >
                I'm Interested
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                aria-label="Write To Us"
                onClick={handleWriteToUs}
              >
                Write To Us
              </button>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="flex flex-col gap-8 mb-8">
            {/* Image Container */}
            {campaign.imageUrls && campaign.imageUrls.length > 0 ? (
              campaign.imageUrls.length === 1 ? (
                <div className="flex justify-center">
                  <img
                    src={campaign.imageUrls[0].imageUrl}
                    alt={campaign.campaignType}
                    className="w-1/2 h-[400px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {campaign.imageUrls.map((image, index) => (
                    <img
                      key={image.imageId}
                      src={image.imageUrl}
                      alt={`${campaign.campaignType} - ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                    />
                  ))}
                </div>
              )
            ) : null}

            {/* Content Container */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              {campaign.campaignDescription && (
                <div className="prose max-w-none">
                  {campaign.campaignDescription
                    .split("\n")
                    .map((paragraph, index) => {
                      if (paragraph.startsWith("###")) {
                        return (
                          <h2
                            key={index}
                            className="text-xl font-bold text-gray-800 mb-4"
                          >
                            {paragraph.replace("###", "").trim()}
                          </h2>
                        );
                      } else if (paragraph.trim().startsWith("-")) {
                        return (
                          <ul key={index} className="list-disc pl-6 mb-4">
                            <li className="text-gray-600">
                              {paragraph.replace("-", "").trim()}
                            </li>
                          </ul>
                        );
                      } else if (paragraph.includes("**")) {
                        return (
                          <p
                            key={index}
                            className="font-bold text-gray-800 mb-4"
                          >
                            {paragraph.replace(/\*\*/g, "").trim()}
                          </p>
                        );
                      } else {
                        return (
                          <p key={index} className="text-gray-600 mb-4">
                            {paragraph.trim()}
                          </p>
                        );
                      }
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
