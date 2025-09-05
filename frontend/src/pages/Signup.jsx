import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/signup`, form);
      alert("Signup successful ✅ Please login");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Container */}
      <div className="hidden md:flex w-1/2 bg-red-600 flex-col justify-center items-center text-white p-10">
        <h1 className="text-3xl font-bold mb-4">Looks like you're new here!</h1>
        <p className="text-lg">Sign up with your details to get started</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>

          <input
            type="text"
            name="name"
            placeholder="Enter Name *"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email *"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password *"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number *"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            name="address"
            placeholder="Enter Address (optional)"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            CONTINUE
          </button>

          <div className="flex justify-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already a user? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
