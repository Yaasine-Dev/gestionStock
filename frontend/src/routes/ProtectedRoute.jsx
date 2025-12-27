import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ roles = [], children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(auth.user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
