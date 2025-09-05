import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Star, ShoppingCart, LogOut } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
const options = [
  {
    name: "All Products",
    description: "View, add, edit and delete products",
    icon: Package,
    path: "/admin/products", // ✅ frontend route
  },
  {
    name: "Featured Products",
    description: "Manage featured items",
    icon: Star,
    path: "/admin/featured", // ✅ frontend route
  },
  {
    name: "Customer Orders",
    description: "View and manage customer orders",
    icon: ShoppingCart,
    path: "/admin/orders", // ✅ frontend route
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin auth data here
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />
      {/* Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => navigate(opt.path)} // ✅ route navigation
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex items-start gap-4 border border-gray-100 hover:border-gray-200"
            >
              <div className="p-3 rounded-lg bg-red-50 text-red-600">
                <opt.icon size={22} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 text-sm sm:text-base">
                  {opt.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {opt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
