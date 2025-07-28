// src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the new Sidebar

export default function MainLayout() {
  return (
    // The main layout container
    <div className="app-layout">
      <Sidebar />
      {/* The main content area now has a left margin to not be hidden by the sidebar */}
      <main className="content-area">
        <Outlet /> 
      </main>
    </div>
  );
}