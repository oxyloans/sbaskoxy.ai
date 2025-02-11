import React from "react";
import "./Header.css";
import Logo from ".././assets/img/logo.png";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn1 = () => {
    navigate("/whatsapplogin");
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="ASK OXY AI" />
      </div>
      <div className="header-actions">
        <span
          className="cart-icon"
          title="View Cart"
          role="button"
          aria-label="View Cart"
        >
          🛒
        </span>
        <button
          className="sign-in-btn"
          aria-label="Sign In"
          onClick={handleSignIn1}
        >
          Sign in
        </button>
      </div>
    </header>
  );
};

export default Header;
