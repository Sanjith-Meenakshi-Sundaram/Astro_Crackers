import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-center px-6">
      <h1 className="text-9xl font-bold text-indigo-600">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 text-white bg-indigo-600 rounded-2xl shadow-md hover:bg-indigo-700 transition-all duration-200"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
