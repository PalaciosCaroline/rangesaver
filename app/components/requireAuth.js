import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  return user ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
