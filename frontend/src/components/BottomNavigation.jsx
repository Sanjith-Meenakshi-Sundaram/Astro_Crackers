// src/components/BottomNavigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Package } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <Home size={18} />, label: "Home" },
    { to: "/cart", icon: <ShoppingCart size={18} />, label: "Cart" },
    { to: "/orders", icon: <Package size={18} />, label: "Orders" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md 
                 shadow-lg flex justify-around items-center py-2 md:hidden z-50 
                 rounded-t-2xl border-t border-gray-100"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-xs transition-colors duration-200 px-3 py-1 rounded-md ${
              isActive ? "text-red-600 bg-red-50" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;