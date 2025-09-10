import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Call your API with axios
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, form);

      console.log("Admin Login API response:", res.data);

      // ✅ Save both token and user info to localStorage
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("Token saved to localStorage:", localStorage.getItem("adminToken"));

      alert("Admin login successful ✅");

      // ✅ Navigate to admin dashboard (orders page)
      console.log("Navigating to admin orders...");
      navigate("/admin-dashboard");

    } catch (err) {
      console.error("Admin login error:", err);
      alert(err.response?.data?.message || "Admin login failed ❌");
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
                  Admin Dashboard Access
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "LOGGING IN..." : "Admin Sign In"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Not an admin?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  User Login
                </Link>
              </div>

              <div className="text-center">
                <Link to="/signup" className="text-xs text-gray-500 hover:text-gray-700">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/coverphoto5.png"
            alt="Admin Background"
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
                  Admin Dashboard Access
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2.5 text-sm rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-medium"
              >
                {isLoading ? "LOGGING IN..." : "Admin Sign In"}
              </button>

              <div className="text-center text-xs text-gray-600">
                Not an admin?{" "}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  User Login
                </Link>
              </div>

              <div className="text-center">
                <Link to="/signup" className="text-xs text-gray-500 hover:text-gray-700">
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
