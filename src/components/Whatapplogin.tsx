import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./Whatsapp.css";
import { Link } from "react-router-dom";

const Whatapplogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Step 4: Get the intended route before login
  const [credentials, setCredentials] = useState({
    otp: ["", "", "", ""],
  });
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [error, setError] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [otpSession, setOtpSession] = useState<string | null>(null);
  const [showOtp, setOtpShow] = useState<boolean | null>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean | null>(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Step 5: Check if user is already logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    if (userId && accessToken) {
      navigate(location.state?.from || "/dashboard", { replace: true });
    }
  }, [navigate, location]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...credentials.otp];
    newOtp[index] = value;
    setCredentials({ otp: newOtp });

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle submission of the phone number to receive OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      setError("Please Enter a valid WhatsApp Number with Country code.");
      return;
    }
    localStorage.setItem("whatsappNumber", phoneNumber);

    try {
      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
        {
          registrationType: "whatsapp",
          userType: "Login",
          whatsappNumber: phoneNumber,
        }
      );
      setIsButtonEnabled(true);
      if (response.data) {
        localStorage.setItem("mobileOtpSession", response.data.mobileOtpSession);
        localStorage.setItem("salt", response.data.salt);
        localStorage.setItem("expiryTime", response.data.otpGeneratedTime);

        if (response.data.userId !== null) {
          setShowSuccessPopup(true);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("accessToken", response.data.accessToken);

          // Step 4: Redirect user to previous page or dashboard
          setTimeout(() => navigate(location.state?.from || "/dashboard"), 2000);
        } else {
          setOtpShow(true);
          setShowSuccessPopup(true);
          setMessage("OTP sent successfully to your WhatsApp number.");
          setTimeout(() => {
            setShowSuccessPopup(false);
            setMessage("");
          }, 2000);
        }
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("This number is not registered. Please register now.");
    }
  };

  // Handle OTP submission for verification
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");
    setMessage("");

    if (credentials.otp.join("").length !== 4) {
      setOtpError("Please Enter the OTP");
      return;
    }

    try {
      const response = await axios.post(
        "https://meta.oxyglobal.tech/api/user-service/registerwithMobileAndWhatsappNumber",
        {
          registrationType: "whatsapp",
          whatsappOtpSession: localStorage.getItem("mobileOtpSession"),
          whatsappOtpValue: credentials.otp.join(""),
          salt: localStorage.getItem("salt"),
          whatsappNumber: phoneNumber,
          userType: "Login",
          expiryTime: localStorage.getItem("expiryTime"),
        }
      );
      if (response.data) {
        setShowSuccessPopup(true);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("accessToken", response.data.accessToken);

        setMessage("Login Successful");

        // Step 4: Redirect user to previous page or dashboard
        setTimeout(() => navigate(location.state?.from || "/dashboard"), 500);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setOtpError("Invalid OTP. Please try again.");
        setOtpSession(response.data.mobileOtpSession);
      }
    } catch (err: any) {
      setOtpError("Invalid OTP");
      setOtpSession(err);
    }
  };

  return (
    <div className="login-container">
      {showSuccessPopup && (
        <div className="popup-message">
          <p>{message}</p>
        </div>
      )}

      <div className="form-container">
        <h2 className="login-header">LOGIN TO ASKOXY.AI</h2>
        <form onSubmit={showOtp ? handleOtpSubmit : handleSubmit}>
          <div className="form-group">
            <label>
              WhatsApp Number <span style={{ color: "red" }}>*</span>
            </label>
            <div className="phoneinputfield">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                defaultCountry="IN"
                international
                className="PhoneInputInput"
              />
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          {showOtp && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-inputs">
                {credentials.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el!)}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onFocus={(e) => e.target.select()}
                    className="otp-circle"
                  />
                ))}
              </div>
              {otpError && <span className="error-message">{otpError}</span>}
            </div>
          )}

          {message && !showSuccessPopup && (
            <span className="success-message">{message}</span>
          )}

          <button type="submit" className="button">
            {otpSession ? "Submit OTP" : "Submit"}
          </button>

          {isButtonEnabled && (
            <button
              type="button"
              onClick={() => setOtpShow(false)}
              className="change-number-button"
            >
              Change Number
            </button>
          )}
        </form>
        <p className="or-divider">OR</p>

        <div className="alternate-login">
          <span>Are you not registered yet? </span>
          <Link to="/whatsappregister" className="register-link">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Whatapplogin;
