import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isAdminRoute?: boolean;
  isAdmin?: boolean;
  element: React.ReactElement;
}

export function ProtectedRoute({
  isAuthenticated,
  isAdminRoute = false,
  isAdmin = false,
  element,
}: ProtectedRouteProps) {
  if (isAdminRoute) {
    // This is an admin route
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      // User is authenticated but not an admin, redirect to home or an unauthorized page
      return <Navigate to="/" replace />;
    }
    // User is authenticated and is an admin, render the element
    return element;
  }

  // This is a general protected route (not specifically admin)
  if (!isAuthenticated) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated (and it's not an admin-only route or they are admin for it), render the element
  return element;
}
