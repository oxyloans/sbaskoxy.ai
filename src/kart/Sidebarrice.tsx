import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineGift,
  AiOutlineWallet,
  AiOutlineStar,
} from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import { BsCreditCard } from "react-icons/bs";
import { FaRegComments } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => {
    setHoveredMenu(menu);
  };

  const handleMouseLeave = () => {
    setHoveredMenu(null);
  };

  const menuItems = [
    { to: "/myorders", icon: <AiOutlineShoppingCart />, label: "My Orders" },
    { to: "/profile", icon: <AiOutlineUser />, label: "Profile Information" },
    { to: "/manageaddresses", icon: <FiMapPin />, label: "Manage Addresses" },
    { to: "/mycoupons", icon: <AiOutlineGift />, label: "My Coupons" },
    { to: "/subscription", icon: <BsCreditCard />, label: "My Subscriptions" },
    { to: "/wallet", icon: <AiOutlineWallet />, label: "My Wallet" },
    { to: "/myreviews", icon: <AiOutlineStar />, label: "My Reviews & Ratings" },
    { to: "/writetous", icon: <FaRegComments />, label: "Write to Us" },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white shadow-lg p-4 flex flex-col items-center md:items-start transition-all duration-200">
      <nav>
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start py-3 px-4 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-purple-700 text-white font-bold"
                      : "text-gray-600 hover:bg-purple-100"
                  }`
                }
              >
                <span className="text-2xl">{item.icon}</span>
                {/* Show text on larger screens and when hovered */}
                <span
                  className={`ml-3 text-sm font-medium hidden md:block ${
                    hoveredMenu === item.label ? "block" : "hidden"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
