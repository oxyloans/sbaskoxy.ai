import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineWallet,
} from 'react-icons/ai';
import { FiMapPin  } from 'react-icons/fi';
import { BsCreditCard } from 'react-icons/bs';
import { FaRegComments,FaUserFriends } from 'react-icons/fa';

const AnimatedLogoutButton = ({ onClick, isMobile }: { onClick: () => void, isMobile: boolean }) => {
  const [buttonState, setButtonState] = useState('default');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setButtonState('clicked');
      
      setTimeout(() => setButtonState('walking1'), 100);
      setTimeout(() => setButtonState('walking2'), 400);
      setTimeout(() => setButtonState('falling1'), 800);
      setTimeout(() => setButtonState('falling2'), 1200);
      setTimeout(() => {
        setButtonState('default');
        setIsAnimating(false);
        onClick();
      }, 1600);
    }
  };

  const getDoorTransform = () => {
    switch (buttonState) {
      case 'hover':
        return '-rotate-y-20';
      case 'clicked':
      case 'walking1':
        return '-rotate-y-35';
      case 'walking2':
        return '-rotate-y-45';
      default:
        return '';
    }
  };

  const getFigureTransform = () => {
    switch (buttonState) {
      case 'hover':
        return '-translate-x-[1.5px]';
      case 'walking1':
        return '-translate-x-[11px]';
      case 'walking2':
        return '-translate-x-[17px]';
      case 'falling1':
      case 'falling2':
        return 'translate-y-[1080px] opacity-0 -rotate-360';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAnimating}
      className={`relative w-full h-12 rounded-md bg-transparent text-gray-600 font-medium overflow-hidden 
        transition-all duration-200 hover:bg-[#faf5ff] flex items-center justify-start py-3 px-4 
        ${isAnimating ? 'cursor-not-allowed' : ''}`}
      onMouseEnter={() => !isAnimating && setButtonState('hover')}
      onMouseLeave={() => !isAnimating && setButtonState('default')}
    >
      <div className="flex items-center w-full">
        <svg className="h-6 w-6" viewBox="0 0 100 100">
          <path
            d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z"
            className="fill-[#4B5563]"
          />
        </svg>

        <svg 
          className={`h-6 w-6 absolute transition-all duration-300 transform perspective-1000
            ${getFigureTransform()}`}
          viewBox="0 0 100 100"
        >
          <circle cx="52.1" cy="32.4" r="6.4" className="fill-[#4B5563]" />
          <path
            d="M50.7 62.8c-1.2 2.5-3.6 5-7.2 4-3.2-.9-3.9-3.5-4-7.8.7-3.4 3.1-13.8 4.1-15.8 1.7-3.4 1.6-4.6 7-3.7 4.3.7 4.6 2.5 4.3 5.4-.4 3.7-2.8 15.1-4.2 17.9z"
            className="fill-[#4B5563]"
          />
          <g className="arm1 transition-transform duration-300">
            <path
              d="M55.5 56.5l-6-9.5c-1-1.5-.6-3.5.9-4.4 1.5-1 3.7-1.1 4.6.4l6.1 10c1 1.5.3 3.5-1.1 4.4-1.5.9-3.5.5-4.5-.9z"
              className="fill-[#4B5563]"
            />
          </g>
          <g className="arm2 transition-transform duration-300">
            <path
              d="M34.2 43.6L45 40.3c1.7-.6 3.5.3 4 2 .6 1.7-.3 4-2 4.5l-10.8 2.8c-1.7.6-3.5-.3-4-2-.6-1.6.3-3.4 2-4z"
              className="fill-[#4B5563]"
            />
          </g>
          <g className="leg1 transition-transform duration-300">
            <path
              d="M52.1 73.2s-7-5.7-7.9-6.5c-.9-.9-1.2-3.5-.1-4.9 1.1-1.4 3.8-1.9 5.2-.9l7.9 7c1.4 1.1 1.7 3.5.7 4.9-1.1 1.4-4.4 1.5-5.8.4z"
              className="fill-[#4B5563]"
            />
          </g>
          <g className="leg2 transition-transform duration-300">
            <path
              d="M37.8 72.7s1.3-10.2 1.6-11.4 2.4-2.8 4.1-2.6c1.7.2 3.6 2.3 3.4 4l-1.8 11.1c-.2 1.7-1.7 3.3-3.4 3.1-1.8-.2-4.1-2.4-3.9-4.2z"
              className="fill-[#4B5563]"
            />
          </g>
        </svg>

        <svg
          className={`h-6 w-6 absolute transition-transform duration-300 transform perspective-1000 origin-left
            ${getDoorTransform()}`}
          viewBox="0 0 100 100"
        >
          <path
            d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z"
            className="fill-[#4B5563]"
          />
          <circle cx="66" cy="50" r="3.7" className="fill-white" />
        </svg>

        <span className="ml-3 text-sm">Sign Out</span>
      </div>
    </button>
  );
};

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { to: '/myorders', icon: <AiOutlineShoppingCart />, label: 'My Orders' },
    { to: '/profile', icon: <AiOutlineUser />, label: 'Profile Information' },
    { to: '/wallet', icon: <AiOutlineWallet />, label: 'My Wallet' },   
    { to: '/subscription', icon: <BsCreditCard />, label: 'My Subscriptions' },    
    { to: '/referral', icon: <FaUserFriends />, label: 'Referral' },
    { to: '/writetous', icon: <FaRegComments />, label: 'Write to Us' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-4 flex flex-col items-start transition-all duration-200">
      <style>
        {`
          .nav-link {
            position: relative;
            transition: all 0.2s ease;
            color: #4B5563;
            width: 100%;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background-color: #9333ea;
            transform: scaleY(0);
            transition: transform 0.2s ease;
          }

          .nav-link.active {
            color: #9333ea;
            font-weight: 600;
          }

          .nav-link.active::before {
            transform: scaleY(1);
          }

          .icon {
            transition: transform 0.2s ease;
            font-size: 1.5rem;
          }
        `}
      </style>
      <nav className="w-full">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.label} className="relative w-full">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-link flex items-center justify-start py-3 px-4 rounded-md ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="icon">{item.icon}</span>
                <span className="ml-3 text-sm font-medium">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
          <li className="relative w-full">
            <AnimatedLogoutButton onClick={handleLogout} isMobile={isMobile} />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;