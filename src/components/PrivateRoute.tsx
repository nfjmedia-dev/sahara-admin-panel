// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // If the user is authenticated, render the element, otherwise redirect to login
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
