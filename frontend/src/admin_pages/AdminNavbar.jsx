import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminNavbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Rotating promotional texts
  const promotionalTexts = [
    "Premium factory crackers at the best prices!",
    "Save 60–80% with direct factory rates!",
    "Wholesale quality, zero middleman costs!",
    "Unbeatable quality & price!"
  ];

  // Auto-rotate promotional text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % promotionalTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle go back to home
  const handleGoHome = () => {
    navigate("/");
  };

  // Toggle profile menu
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Promotional Top Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center">
            <div className="animate-pulse mr-2">
              <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
            </div>
            <div className="text-xs md:text-sm font-medium">
              <span className="inline-block transition-all duration-500 ease-in-out">
                {promotionalTexts[currentTextIndex]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/admin-dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
                <span className="text-lg font-bold text-gray-800 hidden sm:block">
                  Admin Panel
                </span>
              </Link>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-3">
              {/* Go Back to Home */}
              <button
                onClick={handleGoHome}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 text-sm"
                title="Go to Home"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 text-sm"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-1 p-1.5 text-gray-600 hover:text-red-600 transition-colors duration-200 rounded-md hover:bg-red-50"
                >
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-red-600" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm hidden md:inline">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 hidden md:inline ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 
                              transition-all duration-200 transform ${
                                isProfileMenuOpen
                                  ? "opacity-100 visible translate-y-0"
                                  : "opacity-0 invisible -translate-y-2"
                              }`}
                >
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;