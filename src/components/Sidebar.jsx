// src/components/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

// Accept isOpen and onClose props
export default function Sidebar({ isOpen, onClose }) { 
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name[0];
  };

  // Close sidebar when a nav link is clicked on mobile
  const handleNavLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    // Add the "open" class based on the isOpen prop
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">🚀</div>
        <span className="logo-text">Client Portal</span>
      </div>
      <nav className="sidebar-nav">
        {/* Add onClick to all NavLinks */}
        <NavLink to="/dashboard" className="nav-link" onClick={handleNavLinkClick}>
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/contact" className="nav-link" onClick={handleNavLinkClick}>
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