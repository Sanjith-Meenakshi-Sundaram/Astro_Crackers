import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import BottomNavigation from "./components/BottomNavigation";
// import Category from "./pages/Category";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
// import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
// import Profile from "./pages/Profile";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
import Navbar from "./components/Navbar";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          {/* <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} /> */}
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}
