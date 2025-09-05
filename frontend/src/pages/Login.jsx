import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      
      console.log("Login API response:", res.data); // Debug log
      
      // Extract user data and token from response
      const { token, user } = res.data;
      
      // Call the login function from AuthContext
      login(user, token);
      
      alert("Login successful ✅");
      console.log("Navigating to home..."); // Debug log
      navigate("/"); // redirect home
      
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Container */}
      <div className="hidden md:flex w-1/2 bg-red-600 flex-col justify-center items-center text-white p-10">
        <h1 className="text-3xl font-bold mb-4">Looks like you're back!</h1>
        <p className="text-lg">Login with your email & password to continue</p>
        <img
          src="https://placehold.co/200x200"
          alt="dummy"
          className="mt-6 rounded-lg"
        />
      </div>

      {/* Right Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full border p-2 rounded mb-4 disabled:bg-gray-100"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full border p-2 rounded mb-4 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOGGING IN..." : "CONTINUE"}
          </button>

          <div className="flex flex-col items-center mt-4">
            <Link to="/signup" className="text-blue-600 hover:underline">
              New to the website? Sign up
            </Link>
            <Link to="/admin-login" className="text-gray-600 mt-2 hover:underline">
              Admin?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;