import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, Mail, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileProfileMenuOpen, setIsMobileProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { user, token, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Rotating promotional texts
  const promotionalTexts = [
    "All crackers in our shop are premium quality and sourced directly from factory - Best prices guaranteed!",
    "Direct factory sourcing means 40-80% cheaper prices on all crackers!",
    "Quality crackers at wholesale prices - No middleman, maximum savings!",
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
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileMenuOpen(false);
      }
      if (!event.target.closest('.mobile-profile-dropdown')) {
        setIsMobileProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle contact actions
  const handlePhoneCall = (e) => {
    e.preventDefault();
    const phoneNumber = '8300372046';
    window.open(`tel:+91${phoneNumber}`, '_self');
  };

  const handleEmail = (e) => {
    e.preventDefault();
    const emailAddress = 'crackers.astro@gmail.com';
    const subject = 'Inquiry about Crackers';
    const body = 'Hello, I would like to know more about your products.';
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_self');
  };

  // Handle search query
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
      setIsMobileProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle profile menu toggle
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Handle mobile profile menu toggle
  const toggleMobileProfileMenu = (e) => {
    e.stopPropagation();
    setIsMobileProfileMenuOpen(!isMobileProfileMenuOpen);
  };

  // Close all menus
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileMenuOpen(false);
    setIsMobileProfileMenuOpen(false);
  };

  return (
    <>
      {/* Promotional Top Bar */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-1.5 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left - Promotional Text */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center">
              <div className="animate-pulse mr-2">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
              </div>
              <div className="text-xs md:text-sm font-medium whitespace-nowrap">
                <span className="inline-block transition-all duration-500 ease-in-out">
                  {promotionalTexts[currentTextIndex]}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Contact Options */}
          <div className="flex items-center space-x-3 ml-4">
            {/* Phone */}
            <button
              onClick={handlePhoneCall}
              className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 group"
            >
              <Phone size={14} className="group-hover:animate-bounce" />
              <span className="text-xs font-medium hidden sm:inline">+91 8300372046</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmail}
              className="flex items-center space-x-1 text-white hover:text-yellow-300 transition-colors duration-200 group"
            >
              <Mail size={14} className="group-hover:animate-bounce" />
              <span className="text-xs font-medium hidden lg:inline">crackers.astro@gmail.com</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}

      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2" onClick={closeAllMenus}>
                <img
                  src="/logo_astro.png"
                  alt="Astro Crackers Logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-lg font-bold text-red-600 block">
                  Astro Crackers
                </span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-lg mx-6">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for crackers..."
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-full 
                             focus:ring-2 focus:ring-red-500 focus:border-transparent 
                             outline-none transition-all duration-200 text-sm"
                />
              </form>
            </div>

            {/* Desktop Right Menu */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-1.5 text-gray-600 hover:text-red-600 transition-colors duration-200"
                onClick={closeAllMenus}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full 
                                   h-4 w-4 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist">
                <button className="relative p-1.5 text-gray-600 hover:text-red-600 transition-colors duration-200">
                  <Heart size={20} />
                </button>
              </Link>

              {/* Auth / Profile */}
              {isAuthenticated ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-1 p-1.5 text-gray-600 hover:text-red-600 transition-colors duration-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <User size={14} className="text-red-600" />
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{user?.name || 'Profile'}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <div className={`absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 
                                  transition-all duration-200 transform ${isProfileMenuOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <div className="px-3 py-1.5 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Wishlist
                    </Link>
                    <hr className="my-0.5" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 text-sm"
                    onClick={closeAllMenus}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 text-sm"
                    onClick={closeAllMenus}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Right Icons */}
            <div className="md:hidden flex items-center space-x-1">
              {/* Wishlist for mobile */}
              <Link
                to="/wishlist"
                className="relative p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                onClick={closeAllMenus}
              >
                <Heart size={18} />
              </Link>

              {/* Profile for mobile */}
              {isAuthenticated ? (
                <div className="relative mobile-profile-dropdown">
                  <button
                    onClick={toggleMobileProfileMenu}
                    className="relative p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <User size={14} className="text-red-600" />
                    </div>
                  </button>

                  {/* Mobile Profile Dropdown Menu */}
                  <div className={`absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50
                                  transition-all duration-200 transform ${isMobileProfileMenuOpen
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <div className="px-3 py-1.5 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      My Wishlist
                    </Link>
                    <hr className="my-0.5" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-1.5 text-sm text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={closeAllMenus}
                >
                  <User size={18} />
                </Link>
              )}

              {/* Cart for mobile */}
              <Link
                to="/cart"
                className="relative p-1.5 text-gray-600 hover:text-red-600 transition-colors"
                onClick={closeAllMenus}
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full 
                                   h-3 w-3 flex items-center justify-center animate-pulse text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Search size={18} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden py-3 border-t border-gray-100 animate-fadeIn">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for crackers..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md 
                             focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                  autoFocus
                />
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 animate-fadeIn">
              <div className="py-3 space-y-1">
                {isAuthenticated ? (
                  <>
                    {/* Profile Header */}
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-md mx-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md mx-2 text-sm"
                      onClick={closeAllMenus}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md mx-2 text-sm"
                      onClick={closeAllMenus}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md mx-2 text-sm"
                      onClick={closeAllMenus}
                    >
                      My Wishlist
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md mx-2 text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="px-2 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center px-3 py-2 text-red-600 border border-red-600 rounded-md 
                                 hover:bg-red-50 font-medium transition-all duration-200 text-sm"
                      onClick={closeAllMenus}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md 
                                 font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                      onClick={closeAllMenus}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Red Navigation Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8 py-2">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 font-medium text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-300 font-medium text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              ABOUT
            </Link>
            <Link
              to="/quickorder"
              className="text-white hover:text-yellow-300 font-medium text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              QUICK ORDER
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-yellow-300 font-medium text-sm transition-colors duration-200 px-2 py-1 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              CONTACT US
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-center space-x-4 py-1.5 px-4">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 font-medium text-xs transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              HOME
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-300 font-medium text-xs transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              ABOUT
            </Link>
            <Link
              to="/quickorder"
              className="text-white hover:text-yellow-300 font-medium text-xs transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              QUICK ORDER
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-yellow-300 font-medium text-xs transition-colors duration-200 px-1.5 py-0.5 rounded hover:bg-white/10"
              onClick={closeAllMenus}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;