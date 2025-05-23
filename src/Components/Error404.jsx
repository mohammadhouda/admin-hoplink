import React from "react";
import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="error-404 min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">Page Not Found</p>
      <p className="text-gray-600 mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default Error404;
