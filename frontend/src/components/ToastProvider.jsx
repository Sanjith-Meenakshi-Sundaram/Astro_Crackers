// src/components/ToastProvider.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default ToastProvider;
