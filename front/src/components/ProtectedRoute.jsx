// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ element: Component, roles }) => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('AuthContext is undefined in ProtectedRoute.');
    return <Navigate to="/login" replace />;
  }

  const { user } = context;
  const isAuthenticated = !!user;
  const isAuthorized = user && roles.includes(user.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Component />;
};

export default ProtectedRoute;