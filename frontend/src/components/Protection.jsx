// components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");

  // If no admin token, block access
  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
