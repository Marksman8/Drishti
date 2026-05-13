import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, isAuthenticated } from '../services/AuthService';

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const user = getUser();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;
