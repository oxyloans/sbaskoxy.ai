import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { FiUploadCloud, FiClock, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { Menu, X } from 'lucide-react';

interface ProfileData {
  userFirstName: string;
  userLastName: string;
  customerEmail: string;
  whatsappNumber: string;
}

interface FormErrors {
  query: string;
  documentId: string;
  profile?: string;
}

const CustomAlert: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-gray-600 mb-6">
        Please complete your profile before proceeding to cart. This helps us serve you better.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const WriteToUs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({ query: "", documentId: "" });
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  const [formData, setFormData] = useState({
    query: "",
    documentName: "",
    documentId: "",
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    userFirstName: "",
    userLastName: "",
    customerEmail: "",
    whatsappNumber: "",
  });

  const storedProfileData = localStorage.getItem("profileData") || "";
  const storedUserId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (storedProfileData) {
      setProfileData(JSON.parse(storedProfileData));
    }
    fetchExistingQuery();
    setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
  }, [id]);

  const checkProfileCompletion = (): boolean => {
    const { userFirstName, userLastName, customerEmail } = profileData;
    if (!userFirstName || !userLastName || !customerEmail) {
      setShowProfileAlert(true);
      return false;
    }
    return true;
  };

  const handleProfileRedirect = () => {
    navigate("/main/profile");
  };

  const fetchExistingQuery = async () => {
    if (!id) return;

    try {
      const response = await axios.get(
        `https://meta.oxyglobal.tech/api/writetous-service/getQuery/${id}`
      );
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          query: response.data.query || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching query:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { query: "", documentId: "" };
    let isValid = true;

    if (!checkProfileCompletion()) {
      return false;
    }

    if (!formData.query.trim()) {
      newErrors.query = "Query is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const data = {
      adminDocumentId: "",
      askOxyOfers: "FREESAMPLE",
      comments: formData.query,
      email: profileData.customerEmail,
      id: id || "",
      mobileNumber: localStorage.getItem("whatsappNumber") || profileData.whatsappNumber,
      projectType: "ASKOXY",
      query: formData.query,
      queryStatus: "PENDING",
      resolvedBy: id ? "user" : "",
      resolvedOn: "",
      status: "",
      userDocumentId: formData.documentId || "",
      userId: storedUserId,
    };

    try {
      await axios.post(
        "https://meta.oxyglobal.tech/api/writetous-service/saveData",
        data
      );
      setFormData({ query: "", documentName: "", documentId: "" });
      showNotification("Query submitted successfully!", "success");
      navigate("/main/tickethistory");
    } catch (error) {
      console.error("Error submitting query", error);
      showNotification("Failed to submit query. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileupload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "kyc");
    formData.append("projectType", "ASKOXY");

    try {
      const response = await axios.post(
        `https://meta.oxyglobal.tech/api/writetous-service/uploadQueryScreenShot?userId=${storedUserId}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setUploadProgress(progress);
          },
        }
      );

      setFormData(prev => ({
        ...prev,
        documentName: response.data.documentName,
        documentId: response.data.id,
      }));
      setErrors(prev => ({ ...prev, documentId: "" }));
      showNotification("File uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading file", error);
      showNotification("Failed to upload file. Please try again.", "error");
    } finally {
      setUploadProgress(0);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    const notificationElement = document.createElement("div");
    notificationElement.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white transform transition-transform duration-300 ease-in-out`;
    notificationElement.textContent = message;
    document.body.appendChild(notificationElement);
    setTimeout(() => {
      notificationElement.remove();
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CustomAlert
        isOpen={showProfileAlert}
        onClose={() => setShowProfileAlert(false)}
        onConfirm={handleProfileRedirect}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <main className="flex-1 p-4 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                    Write to us
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <p className="text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/main/tickethistory")}
                  className="group flex items-center gap-2 bg-purple-50 text-purple-700 px-6 py-3 rounded-full hover:bg-purple-100 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  <span>View Ticket History</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={`${profileData.userFirstName} ${profileData.userLastName}`.trim()}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        !profileData.userFirstName && !profileData.userLastName ? 'border-red-500' : 'border-gray-200'
                      } bg-gray-50`}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={profileData.customerEmail}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        !profileData.customerEmail ? 'border-red-500' : 'border-gray-200'
                      } bg-gray-50`}
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={localStorage.getItem("whatsappNumber") || profileData.whatsappNumber}
                      placeholder="Enter your phone number"
                      readOnly
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
                    />
                  </div>

                  {id === undefined && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Attachment (Optional)
                      </label>
                      <div className="relative">
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-purple-50 text-purple-600 rounded-lg border-2 border-purple-100 border-dashed cursor-pointer hover:bg-purple-100 transition-all duration-300">
                          <FiUploadCloud className="w-8 h-8 mb-2" />
                          <span className="text-sm font-medium">
                            Click to upload file
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileupload}
                          />
                        </label>
                        {uploadProgress > 0 && (
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-100">
                            <div
                              className="h-full bg-purple-600 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                        {formData.documentName && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                            <FiCheckCircle className="w-4 h-4" />
                            <span>{formData.documentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Your Query *
                  </label>
                  <textarea
                    rows={4}
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                      errors.query ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Please describe your query in detail..."
                  ></textarea>
                  {errors.query && (
                    <p className="text-sm text-red-500">{errors.query}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-600 to-purple-400 text-white py-4 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Query"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default WriteToUs;