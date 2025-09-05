import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, form);
      localStorage.setItem("adminToken", res.data.token);
      alert("Admin login successful ✅");
      navigate("/admin-dashboard"); // redirect to admin dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Admin login failed ❌");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Container */}
      <div className="hidden md:flex w-1/2 bg-red-600 flex-col justify-center items-center text-white p-10">
        <h1 className="text-3xl font-bold mb-4">Welcome Admin!</h1>
        <p className="text-lg">Login with your credentials</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            CONTINUE
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
