import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // treat missing or string 'undefined' as not authenticated
  if (!token || token === "undefined") {
    // keep history clean by replacing
    return <Navigate to="/login" replace />;
  }
  // token exists — allow access
  return children;
};

export default ProtectedRoute;
