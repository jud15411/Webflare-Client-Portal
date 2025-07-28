// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import ClientContactPage from './pages/ClientContactPage'; 
import ProjectDetailPage from './pages/ProjectDetailPage'; // Import the new page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} /> 
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="contact" element={<ClientContactPage />} />
          {/* Add the new dynamic route for project details */}
          <Route path="project/:id" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;