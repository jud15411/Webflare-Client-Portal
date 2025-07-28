// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You need to install this library

// --- Installation ---
// Run this in your terminal:
// npm install jwt-decode
// --------------------

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for a token in localStorage when the app first loads
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedUser = jwtDecode(token);
        // Optional: Check if the token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          // Token is expired, remove it
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error("Failed to decode token on initial load", error);
      // Clear potentially corrupt token
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false); // Finished loading user state
    }
  }, []);

  const login = (token) => {
    try {
      // 1. Store the token
      localStorage.setItem('authToken', token);
      // 2. Decode the token to get user info (like name, role, etc.)
      const decodedUser = jwtDecode(token);
      // 3. **THIS IS THE CRITICAL STEP** - Update the user state
      setUser(decodedUser);
    } catch (error) {
      console.error("Failed to decode token on login", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // The value provided to consuming components
  const value = { user, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until we've checked for a user */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;