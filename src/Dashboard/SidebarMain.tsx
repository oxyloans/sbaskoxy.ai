import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  User,
  Wallet,
  CreditCard,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.clear();
    navigate("/");
  }

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse(newCollapsed);
  };

  const menuItems = [
    {
      to: "/main",
      icon: <LayoutDashboard className="text-xl" />,
      label: "Dashboard",
    },
    {
      to: "/main/myorders",
      icon: <ShoppingCart className="text-xl" />,
      label: "My Orders",
    },
    {
      to: "/main/profile",
      icon: <User className="text-xl" />,
      label: "Profile Information",
    },
    {
      to: "/main/wallet",
      icon: <Wallet className="text-xl" />,
      label: "My Wallet",
    },
    {
      to: "/main/subscription",
      icon: <CreditCard className="text-xl" />,
      label: "My Subscriptions",
    },
    {
      to: "/main/referral",
      icon: <Users className="text-xl" />,
      label: "Referral",
    },
    {
      to: "/main/writetous",
      icon: <MessageSquare className="text-xl" />,
      label: "Write to Us",
    },
  ];

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-end items-center mb-8 px-4">
        <button
          onClick={toggleCollapse}
          className={`p-2 rounded-full hover:bg-purple-100 transition-all duration-300 border shadow-sm hidden md:block 
            ${isCollapsed ? "mx-auto" : ""}`}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <div className={`flex-1 space-y-1 ${isCollapsed ? "px-1" : "px-1"}`}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={index}
              to={item.to}
              className={`relative flex items-center rounded-lg transition-all duration-300 hover:bg-purple-100 group
                ${isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-4"}
                ${isActive ? "bg-purple-600" : ""}`}
            >
              <div className="flex items-center relative">
                <span className={`${isActive ? "text-white" : "text-gray-600 group-hover:text-purple-600"}`}>
                  {item.icon}
                </span>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300
                    ${isCollapsed ? "hidden" : "opacity-100 ml-4"}
                    ${isActive ? "text-white" : "text-gray-700 group-hover:text-purple-600"}`}
                >
                  {item.label}
                </span>
              </div>

              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4">
        <button
          onClick={handleSignout}
          className={`relative flex items-center rounded-lg transition-all duration-300 hover:bg-purple-100 group
            ${isCollapsed ? "justify-center p-2" : "px-4 py-3 gap-4"}`}
        >
          <span className="text-gray-600 group-hover:text-purple-600">
            <LogOut className="text-xl" />
          </span>

          {!isCollapsed && (
            <span className="text-gray-700 font-medium group-hover:text-purple-600">Sign Out</span>
          )}

          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg">
              Sign Out
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;