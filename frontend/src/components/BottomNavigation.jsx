// src/components/BottomNavigation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart, Package } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <Home size={22} />, label: "Home" },
    { to: "/cart", icon: <ShoppingCart size={22} />, label: "Cart" },
    { to: "/orders", icon: <Package size={22} />, label: "Orders" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md 
                 shadow-lg flex justify-around items-center py-3 md:hidden z-50 
                 rounded-t-3xl"
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-sm transition-colors duration-200 ${
              isActive ? "text-red-600" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
