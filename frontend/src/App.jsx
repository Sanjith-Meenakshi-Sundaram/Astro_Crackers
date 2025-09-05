import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import BottomNavigation from "./components/BottomNavigation";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Navbar from "./components/Navbar";
import AdminNavbar from "./admin_pages/AdminNavbar";
import WhatsAppWidget from "./components/WhatsAppWidget";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./admin_pages/AdminDashboard";
import CategoryPage from "./admin_pages/CategoryPage";
import AllProductsPage from "./admin_pages/products";
import FeaturedProductsPage from "./admin_pages/featured";
import CustomerOrdersPage from "./admin_pages/orders";

export default function App() {
  const location = useLocation();
  
  // Check if current route is admin route (except admin login)
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin-login';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Render Admin Navbar for admin routes, Regular Navbar for others */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      
      {/* Add top padding when admin navbar is showing */}
      <main className={`flex-1 container mx-auto px-4 py-6 ${isAdminRoute ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/admin/category/:type" element={<CategoryPage />} />
          <Route path="/admin/products" element={<AllProductsPage />} />
          <Route path="/admin/featured" element={<FeaturedProductsPage />} />
          <Route path="/admin/orders" element={<CustomerOrdersPage />} />
        </Routes>
      </main>

      {/* WhatsApp Widget - Hide on admin routes */}
      {!isAdminRoute && <WhatsAppWidget />}

      {/* Bottom Navigation - Hide on admin routes */}
      {!isAdminRoute && <BottomNavigation />}
    </div>
  );
}