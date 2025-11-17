import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { auth } = useContext(AppContext);

  // Check if user is authenticated and is an admin
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (auth?.role !== "ROLE_ADMIN") {
    return <Navigate to="/explore" replace />;
  }

  return children;
};

export default ProtectedRoute;
