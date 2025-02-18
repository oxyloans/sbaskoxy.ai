import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  X,
  Send,
  KeyRound,
  PhoneCall,
  Loader2,
  MessageCircle,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

const WhatsappRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isClosing, setIsClosing] = useState(false);
  const reffererId = localStorage.getItem("refferrerId");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      navigate(location.state?.from || "/main/dashboard/services", { replace: true });
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const refParam = queryParams.get("ref");
    if (refParam) {
      localStorage.setItem("refferrerId", refParam);
      console.log("Extracted userId:", refParam);
    }
  }, [navigate, location]);

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleOtpChange = (value: string, index: number) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (sanitizedValue.length <= 1) {
      const newOtp = [...credentials.otp];
      newOtp[index] = sanitizedValue;
      setCredentials({ otp: newOtp });

      if (sanitizedValue && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 4);
    const newOtp = [...credentials.otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setCredentials({ otp: newOtp });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !credentials.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid WhatsApp number with country code");
      setIsLoading(false);
      return;
    }
    localStorage.setItem("whatsappNumber", phoneNumber);

    try {
      const requestBody: Record<string, any> = {
        registrationType: "whatsapp",
        userType: "Register",
        whatsappNumber: phoneNumber,
      };

      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );
      setIsButtonEnabled(true);
      if (response.data) {
        localStorage.setItem(
          "mobileOtpSession",
          response.data.mobileOtpSession
        );
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

        if (response.data.mobileOtpSession === null) {
          setShowSuccessPopup(false);
          setError("You already registered with this number.");
          setTimeout(() => navigate("/whatsapplogin"), 4000);
        } else {
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage("OTP sent successfully to your WhatsApp number");
          setResendDisabled(true);
          setResendTimer(30);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setMessage("");
    setIsLoading(true);

    if (credentials.otp.join("").length !== 4) {
      setOtpError("Please enter the complete OTP");
      setIsLoading(false);
      return;
    }

    try {
      const requestBody: Record<string, any> = {
        registrationType: "whatsapp",
        whatsappOtpSession: localStorage.getItem("mobileOtpSession"),
        whatsappNumber: phoneNumber,
        salt: localStorage.getItem("salt"),
        userType: "Register",
        whatsappOtpValue: credentials.otp.join(""),
        expiryTime: localStorage.getItem("expiryTime"),
      };

      if (reffererId) {
        requestBody.referrer_id = reffererId;
      }

      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );

      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        setMessage("Registration Successful");
        localStorage.removeItem("refferrerId");
        localStorage.removeItem("mobileOtpSession");
        localStorage.removeItem("salt");
        localStorage.removeItem("expiryTime");
        setTimeout(() => navigate(location.state?.from || "/main/dashboard/services"), 500);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      setOtpError("Invalid OTP");
      setOtpSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      setResendDisabled(true);
      setResendTimer(30);
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
          {
            registrationType: "whatsapp",
            userType: "Register",
            whatsappNumber: phoneNumber,
          }
        );
        if (response.data) {
          localStorage.setItem(
            "mobileOtpSession",
            response.data.mobileOtpSession
          );
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

          setShowSuccessPopup(true);
          setMessage("OTP resent successfully to your WhatsApp number");
          // Clear existing OTP
          setCredentials({ otp: ["", "", "", ""] });
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      } catch (err) {
        setError("Failed to resend OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div
        className={`max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">
              Register to ASKOXY.AI
            </h2>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessPopup && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Send className="w-5 h-5" />
              {message}
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="p-6">
          <form
            onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
            className="space-y-6"
          >
            <div className="relative w-full">
              <label
                className={`relative -top-2 left-4  text-gray-500 text-sm transition-all ${
                  phoneNumber ? " text-xs text-purple-600" : ""
                }`}
              >
                WhatsApp Number <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="IN"
                  international
                  className="w-full p-3 bg-white/30 backdrop-blur-md shadow-md rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 placeholder-transparent [&>*]:outline-none [&.PhoneInputInput]:outline-none [&.PhoneInputInput]:border-none"
                  disabled={showOtp && !isButtonEnabled}
                  placeholder="Enter your number"
                  style={
                    {
                      "--PhoneInputCountryFlag-borderColor": "transparent",
                    } as any
                  }
                />
                <PhoneCall className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-fadeIn">
                  <X className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            {/* OTP Input */}
            {showOtp && (
              <div className="space-y-4 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3">
                  {credentials.otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (otpRefs.current[index] = el!)}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      onFocus={(e) => e.target.select()}
                      className="w-14 h-14 text-center text-lg font-semibold border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm flex items-center gap-1 animate-fadeIn">
                    <X className="w-4 h-4" />
                    {otpError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isLoading}
                  className="text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-400 flex items-center gap-1 transition-colors group"
                >
                  {resendDisabled ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  Resend OTP {resendDisabled && `${resendTimer}`}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {showOtp ? ( // Check if OTP is shown
                      <>
                        <KeyRound className="w-5 h-5" />
                        Verify OTP
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Get OTP
                      </>
                    )}
                  </>
                )}
              </button>

              {isButtonEnabled && (
                <button
                  type="button"
                  onClick={() => setOtpShow(false)}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Change Number
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            Already registered?{" "}
            <Link
              to="/whatsapplogin"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 group"
            >
              Login Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappRegister;