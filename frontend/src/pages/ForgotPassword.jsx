import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email: email.trim() });
      
      console.log("Forgot Password API response:", res.data);
      
      alert(res.data.message || "Reset link sent to your email ✅");
      setIsEmailSent(true);
      
    } catch (err) {
      console.error("Forgot Password error:", err);
      alert(err.response?.data?.message || "Failed to send reset email ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsEmailSent(false);
    setEmail('');
  };

  if (isEmailSent) {
    return (
      <>
        {/* Large Screens - Side by side layout */}
        <div className="hidden md:flex h-screen overflow-hidden">
          {/* Left Side - White background with success message */}
          <div className="w-1/2 bg-white flex items-center justify-center px-8">
            <div className="w-full max-w-xs text-center">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-200">
                  <img
                    src="/logo_astro.png"
                    alt="Astro Crackers Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Success Message */}
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl px-4 py-3 mx-auto">
                  <h1 className="text-lg font-bold text-green-600 mb-2">
                    Email Sent Successfully!
                  </h1>
                  <p className="text-sm text-green-600">
                    Check your inbox for reset instructions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                
                <p className="text-xs text-gray-500">
                  Don't see the email? Check your spam folder or{' '}
                  <button
                    onClick={handleTryAgain}
                    className="font-medium text-red-600 hover:text-red-500 cursor-pointer underline"
                  >
                    try again
                  </button>
                </p>

                <Link
                  to="/login"
                  className="w-full inline-block bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-1/2">
            <img
              src="/coverphoto5.png"
              alt="Success Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Small Screens */}
        <div className="md:hidden overflow-hidden bg-white flex flex-col">
          <div className="h-1/3 flex-shrink-0">
            <img
              src="/coverphoto2_astro.png"
              alt="Mobile Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-xs text-center">
              <div className="mb-4">
                <div className="inline-block bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl px-3 py-2">
                  <h1 className="text-base font-bold text-green-600">
                    Email Sent Successfully!
                  </h1>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Check your inbox for reset instructions
                </p>
                
                <p className="text-xs text-gray-500">
                  Don't see the email? Check your spam folder or{' '}
                  <button
                    onClick={handleTryAgain}
                    className="font-medium text-red-600 hover:text-red-500 cursor-pointer underline"
                  >
                    try again
                  </button>
                </p>
                
                <Link
                  to="/login"
                  className="w-full inline-block bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors font-medium text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Large Screens - Side by side layout */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {/* Left Side - White background with form */}
        <div className="w-1/2 bg-white flex items-center justify-center px-8">
          <div className="w-full max-w-xs">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-200">
                <img
                  src="/logo_astro.png"
                  alt="Astro Crackers Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Animated Welcome Text */}
            <div className="mb-6">
              <div className="inline-block bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl px-4 py-2 mx-auto">
                <h1 className="text-lg font-bold text-red-600 animate-pulse text-center">
                  Reset Your Password
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                We'll send you a link to reset your password to this email address.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "SENDING EMAIL..." : "Send Reset Link"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Back to Login
                </Link>
              </div>

              <div className="text-center">
                <Link to="/signup" className="text-xs text-gray-500 hover:text-gray-700">
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/coverphoto5.png"
            alt="Forgot Password Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Small Screens - Image on top, form below */}
      <div className="md:hidden overflow-hidden bg-white flex flex-col">
        {/* Top Image - Reduced height */}
        <div className="h-1/3 flex-shrink-0">
          <img
            src="/coverphoto2_astro.png"
            alt="Mobile Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form centered in remaining space */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-xs">
            {/* Animated Welcome Text - No logo for mobile */}
            <div className="mb-4 text-center">
              <div className="inline-block bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl px-3 py-2">
                <h1 className="text-base font-bold text-red-600 animate-pulse">
                  Reset Your Password
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                We'll send you a link to reset your password.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "SENDING EMAIL..." : "Send Reset Link"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Back to Login
                </Link>
              </div>

              <div className="text-center">
                <Link to="/signup" className="text-xs text-gray-500 hover:text-gray-700">
                  Create New Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;