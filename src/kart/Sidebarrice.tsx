import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineGift,
  AiOutlineWallet,
  AiOutlineStar,
} from 'react-icons/ai';
import { FiMapPin, FiLogOut } from 'react-icons/fi';
import { BsCreditCard } from 'react-icons/bs';
import { FaRegComments } from 'react-icons/fa';

const Sidebar: React.FC = () => {
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
    { to: '/manageaddresses', icon: <FiMapPin />, label: 'Manage Addresses' },
    { to: '/subscription', icon: <BsCreditCard />, label: 'My Subscriptions' },
    { to: '/wallet', icon: <AiOutlineWallet />, label: 'My Wallet' },
    { to: '/writetous', icon: <FaRegComments />, label: 'Write to Us' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white rounded-xl shadow-sm p-4 flex flex-col items-center md:items-start transition-all duration-200">
      <style>
        {`
          .nav-item {
            position: relative;
            width: 100%;
          }

          .nav-link {
            position: relative;
            transition: all 0.2s ease;
            color: #4B5563;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background-color: rgb(109, 40, 217);
            transform: scaleY(0);
            transition: transform 0.2s ease;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgb(237, 233, 254);
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: -1;
          }

          .nav-link:hover::after {
            opacity: 1;
          }

          .nav-link.active {
            color: rgb(109, 40, 217);
            font-weight: 600;
          }

          .nav-link.active::before {
            transform: scaleY(1);
          }

          .nav-link:hover .icon {
            transform: translateX(2px);
          }

          .icon {
            transition: transform 0.2s ease;
          }

          .label {
            transition: color 0.2s ease;
          }

          .logout-btn {
            position: relative;
            transition: all 0.2s ease;
            overflow: hidden;
          }

          .logout-btn::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .logout-btn:hover::after {
            opacity: 1;
          }

          .logout-btn:hover .icon {
            transform: translateX(2px);
          }

          @media (max-width: 768px) {
            .nav-link {
              padding: 0.75rem;
            }
            
            .icon {
              font-size: 1.5rem;
            }
          }
        `}
      </style>
      <nav className="w-full">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.label} className="nav-item">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-link flex items-center justify-center md:justify-start py-3 px-4 rounded-md ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="icon text-2xl">{item.icon}</span>
                <span className="label ml-3 text-sm font-medium hidden md:block">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="logout-btn flex items-center justify-center md:justify-start py-3 px-4 rounded-md bg-purple-700 text-white font-bold w-full"
            >
              <span className="icon text-2xl">
                <FiLogOut />
              </span>
              <span className="label ml-3 text-sm hidden md:block">
                Sign Out
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;