import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      
      console.log("Login API response:", res.data);
      
      const { token, user } = res.data;
      
      login(user, token);
      
      alert("Login successful ✅");
      console.log("Navigating to home...");
      navigate("/");
      
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

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
                  Welcome back to Astro Crackers!
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "LOGGING IN..." : "Sign in"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Don't you have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </div>

              <div className="text-center">
                <Link to="/admin-login" className="text-xs text-gray-500 hover:text-gray-700">
                  Admin?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/coverphoto5.png"
            alt="Login Background"
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
                  Welcome back to Astro Crackers!
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Example@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "LOGGING IN..." : "Sign in"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Don't you have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </div>

              <div className="text-center pb-[env(safe-area-inset-bottom)]">
                <Link to="/admin-login" className="text-xs text-gray-500 hover:text-gray-700">
                  Admin?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;