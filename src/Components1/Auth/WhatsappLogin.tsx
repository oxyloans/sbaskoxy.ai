import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber,getCountryCallingCode,parsePhoneNumber, PhoneNumber  } from "react-phone-number-input";
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
  CheckCircle2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const WhatsappLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
    mobileOTP: ["", "", "", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "mobile">("whatsapp");
  const [error, setError] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("91"); // Default to India
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [isClosing, setIsClosing] = useState(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [animateOtp, setAnimateOtp] = useState(false);
  const [isMethodDisabled, setIsMethodDisabled] = useState(false);
  const [changeNumberClicked, setChangeNumberClicked] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken) {
      navigate(location.state?.from || "/main/dashboard/products", {
        replace: true,
      });
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

  // Extract country code from phone number
  useEffect(() => {
    if (phoneNumber) {
      // Extract country code without the + sign
      const code = phoneNumber.split(' ')[0].replace('+', '');
      const phoneNumberS = parsePhoneNumber(phoneNumber)
      // console.log("phoneNumberS", phoneNumberS);
      console.log("phoneNumberS.country", phoneNumberS?.countryCallingCode);
      const countryCode =`+${phoneNumberS?.countryCallingCode}`;
      setCountryCode(countryCode 
        ||
         ""
      );
      setIsMethodDisabled(true); // Disable method selection when number is entered
    } else {
      setIsMethodDisabled(false); // Enable method selection when number is empty
    }
  }, [phoneNumber]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleOtpChange = (value: string, index: number) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (sanitizedValue.length <= 1) {
      if (otpMethod === "whatsapp") {
        const newOtp = [...credentials.otp];
        newOtp[index] = sanitizedValue;
        setCredentials((prev) => ({ ...prev, otp: newOtp }));
      } else {
        const newMobileOtp = [...credentials.mobileOTP];
        newMobileOtp[index] = sanitizedValue;
        setCredentials((prev) => ({ ...prev, mobileOTP: newMobileOtp }));
      }

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
      .slice(0, otpMethod === "whatsapp" ? 4 : 6);
    
    if (otpMethod === "whatsapp") {
      const newOtp = [...credentials.otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 4) newOtp[index] = char;
      });
      setCredentials((prev) => ({
        ...prev,
        otp: newOtp
      }));
    } else {
      const newMobileOtp = [...credentials.mobileOTP];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newMobileOtp[index] = char;
      });
      setCredentials((prev) => ({
        ...prev,
        mobileOTP: newMobileOtp
      }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otpMethod === "whatsapp") {
        if (!credentials.otp[index] && index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
      } else {
        if (!credentials.mobileOTP[index] && index > 0) {
          otpRefs.current[index - 1]?.focus();
        }
      }
    }
  };

  // Extract phone number without country code
  const extractPhoneWithoutCode = (phone: string) => {
    if (!phone) return "";
    // Remove the country code part (format is usually +XX XXXXXXXXXX)
    const parts = phone.split(' ');
    return parts.length > 1 ? parts.slice(1).join('') : phone;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please enter a valid number with country code");
      setIsLoading(false);
      return;
    }
    localStorage.setItem("whatsappNumber", phoneNumber);

    try {
      // Extract phone number without country code
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber);
      
      const requestBody: Record<string, any> = {
        registrationType: otpMethod, // Uses "whatsapp" or "mobile"
        userType: "Login",
        countryCode // Just pass the country code number (e.g., "91" for India)
      };

      // Assign the correct number field based on user selection
      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneWithoutCode.replace(countryCode, '');
      } else {
        requestBody.mobileNumber = phoneWithoutCode.replace(countryCode, '');
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

        if (response.data.userId === null && response.data.userId === undefined && response.data.mobileOtpSession === null && response.data.mobileOtpSession === undefined) {
          setShowSuccessPopup(true);
          setMessage("This number is not registered. Please register now.")
          setTimeout(() => navigate("/whatsappregister"), 1000);
        } else {
          setOtpShow(true);
          setAnimateOtp(true);
          setTimeout(() => setAnimateOtp(false), 1000);
          setShowSuccessPopup(true);
          setMessage(`OTP sent successfully to your ${otpMethod === "whatsapp" ? "WhatsApp" : "mobile"} number`);
          setResendDisabled(true);
          setIsPhoneDisabled(true);
          setResendTimer(30);
          // Reset change number clicked state
          setChangeNumberClicked(false);
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      // setTimeout(() => navigate("/whatsappregister"), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setMessage("");
    setIsLoading(true);

    if (!credentials) {
      setOtpError("Please enter the complete OTP");
      setIsLoading(false);
      return;
    }

    if (otpMethod === "whatsapp") {
      if (credentials.otp.join("").length !== 4) {
        setOtpError("Please enter the complete WhatsApp OTP");
        setIsLoading(false);
        return;
      }
    } else if (otpMethod === "mobile") {
      if (credentials.mobileOTP.join("").length !== 6) {
        setOtpError("Please enter the complete Mobile OTP");
        setIsLoading(false);
        return;
      }
    }

    try {
      // Extract phone number without country code
      const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");
      
      const requestBody: Record<string, any> = {
        registrationType: otpMethod,
        userType: "Login",
        countryCode // Just pass the country code number (e.g., "91" for India)
      };

      if (otpMethod === "whatsapp") {
        requestBody.whatsappNumber = phoneWithoutCode.replace(countryCode, '');
        requestBody.whatsappOtpSession =
          localStorage.getItem("mobileOtpSession");
        requestBody.whatsappOtpValue = credentials.otp.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
      } else {
        requestBody.mobileNumber = phoneWithoutCode.replace(countryCode, '');
        requestBody.mobileOtpSession = localStorage.getItem("mobileOtpSession");
        requestBody.mobileOtpValue = credentials.mobileOTP.join("");
        requestBody.salt = localStorage.getItem("salt");
        requestBody.expiryTime = localStorage.getItem("expiryTime");
      }

      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
        requestBody
      );
      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.removeItem("mobileOtpSession");
        localStorage.removeItem("salt");
        localStorage.removeItem("expiryTime");
        setMessage("Login Successful");
        setTimeout(
          () => navigate(location.state?.from || "/main/dashboard/products"),
          500
        );
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
      setOtpError("");

      try {
        // Extract phone number without country code
        const phoneWithoutCode = extractPhoneWithoutCode(phoneNumber || "");
        
        const requestBody: Record<string, any> = {
          registrationType: otpMethod,
          userType: "Login",
          countryCode // Just pass the country code number (e.g., "91" for India)
        };

        if (otpMethod === "whatsapp") {
          requestBody.whatsappNumber = phoneWithoutCode.replace(countryCode, '');
        } else {
          requestBody.mobileNumber = phoneWithoutCode.replace(countryCode, '');
        }

        const response = await axios.post(
          "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
          requestBody
        );
        if (response.data) {
          localStorage.setItem(
            "mobileOtpSession",
            response.data.mobileOtpSession
          );
          localStorage.setItem("salt", response.data.salt);
          localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

          setShowSuccessPopup(true);
          setMessage(`OTP resent successfully to your ${otpMethod === "whatsapp" ? "WhatsApp" : "mobile"} number`);
          // Clear existing OTP
          setCredentials((prev) => ({
            otp: otpMethod === "whatsapp" ? ["", "", "", ""] : prev.otp,
            mobileOTP:
              otpMethod === "mobile" ? ["", "", "", "", "", ""] : prev.mobileOTP,
          }));
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

  // Phone input change handler that extracts country code
  const handlePhoneChange = (value: string | undefined) => {
    setPhoneNumber(value);
    if (value) {
      // Extract only the country code number without the + sign
      const code = value.split(' ')[0].replace('+', '');
      setCountryCode(code);
    }
  };

  // Method for switching OTP method
  const switchOtpMethod = (method: "whatsapp" | "mobile") => {
    if (!isPhoneDisabled && !isMethodDisabled) { // Only allow switching when not in OTP verification mode and no phone number entered
      setOtpMethod(method);
    }
  };

  // Handle change number button click
  const handleChangeNumber = () => {
    setOtpShow(false);
    setIsPhoneDisabled(false);
    setIsButtonEnabled(false);
    setPhoneNumber(undefined); // Clear the phone number
    setError("");
    setOtpError("");
    setIsMethodDisabled(false); // Re-enable method selection
    setChangeNumberClicked(true); // Mark as clicked once
    
    // Reset OTP fields
    setCredentials({
      otp: ["", "", "", ""],
      mobileOTP: ["", "", "", "", "", ""],
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Header */}
        <div className="bg-purple-600 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-bold text-white text-center">
              Login to ASKOXY.AI
            </h2>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessPopup && (
          <div className="mx-6 mt-6 animate-fadeIn">
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
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
            {/* OTP Method Selection UI */}
            <div className="flex flex-col items-center gap-4 p-4 border-b border-gray-100 pb-6">
              <h2 className="text-lg font-semibold text-gray-800">Login Method</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    otpMethod === "whatsapp"
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${isPhoneDisabled || isMethodDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={() => switchOtpMethod("whatsapp")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    otpMethod === "mobile"
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${isPhoneDisabled || isMethodDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={() => switchOtpMethod("mobile")}
                  disabled={isPhoneDisabled || isMethodDisabled}
                >
                  <Smartphone className="w-5 h-5" />
                  SMS
                </button>
              </div>
            </div>

            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {otpMethod === "whatsapp" ? "WhatsApp Number" : "Mobile Number"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <PhoneInput
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  defaultCountry="IN"
                  disabled={isPhoneDisabled}
                  international={otpMethod === "whatsapp"}
                  countrySelectProps={{ disabled: otpMethod === "mobile" }}
                  className="w-full p-3 bg-white shadow-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-800 placeholder-gray-400 [&>*]:outline-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:border-none PhoneInput"
                  maxLength={15}
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
              <div className={`space-y-4 ${animateOtp ? 'animate-fadeIn' : ''}`}>
                <label className="block text-sm font-medium text-gray-700">
                  Enter {otpMethod === "whatsapp" ? "4-digit WhatsApp" : "6-digit SMS"} OTP
                </label>
                <div className="flex justify-center gap-3">
                  {(otpMethod === "whatsapp"
                    ? credentials.otp
                    : credentials.mobileOTP
                  ).map((digit, index) => (
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
                      className="w-12 h-12 text-center text-lg font-semibold bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-gray-800 shadow-sm"
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
                  Resend OTP {resendDisabled && `(${resendTimer}s)`}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {showOtp ? (
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

              {isButtonEnabled && !changeNumberClicked && (
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  disabled={isLoading}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Change Number
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            Not registered yet?{" "}
            <Link
              to="/whatsappregister"
              className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 group"
            >
              Register Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappLogin;