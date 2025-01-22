import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ session, children }) => {
  if (!session) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // Render the child components if the session is valid
  return children;
};

export default ProtectedRoute;
