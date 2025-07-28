// src/components/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css'; // We will create this file next

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0];
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">🚀</div>
        <span className="logo-text">Client Portal</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-link">
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          <span>💬</span> Contact
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <span className="user-name">{user?.name || 'Client'}</span>
        </div>
        <button onClick={handleLogout} className="btn-logout" title="Logout">
          <span>⏻</span>
        </button>
      </div>
    </aside>
  );
}