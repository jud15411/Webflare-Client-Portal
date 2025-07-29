// src/components/Header.jsx
import React from 'react';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="mobile-header">
      <div className="header-content">
        <span className="logo-text">Client Portal</span>
        <button onClick={onToggleSidebar} className="hamburger-btn" aria-label="Open menu">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;