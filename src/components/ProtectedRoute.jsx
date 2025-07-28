// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  // FIXED: Check for the 'user' object from the context, not 'token'
  const { user, isLoading } = useAuth();

  // Wait until the authentication check is complete
  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // If the check is done and there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the child components (e.g., MainLayout)
  return children;
}