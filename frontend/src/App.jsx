import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupGlobalToast } from './utils/globalAlert';

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
import About from "./pages/About";
import Contact from "./pages/Contact";
import QuickOrder from "./pages/QuickOrder";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// import Toast from "./components/Toast";

// import ToastProvider from "./components/ToastProvider";

export default function App() {
  const location = useLocation();

  // Setup global toast override on app startup
  useEffect(() => {
    const restoreAlert = setupGlobalToast();

    // Cleanup on unmount (optional)
    return () => {
      restoreAlert();
    };
  }, []);

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quickorder" element={<QuickOrder />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
        {/* <ToastProvider/> */}
      </main>

      {/* WhatsApp Widget - Hide on admin routes */}
      {!isAdminRoute && <WhatsAppWidget />}

      {/* Bottom Navigation - Hide on admin routes */}
      {!isAdminRoute && <BottomNavigation />}

      {/* Toast Container - Add this at the end */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: '11px',         // smaller text
          fontFamily: 'inherit',
          zIndex: 9999,
          width: '220px',           // compact width
          minHeight: '32px',        // reduce height
        }}
        toastStyle={{
          borderRadius: '6px',
          padding: '6px 10px',      // tighter padding
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          minHeight: '32px',
          lineHeight: '1.2',
        }}
      />
    </div>
  );
}