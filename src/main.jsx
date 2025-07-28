import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './contexts/AuthContext';
import './index.css'; // Make sure the CSS file is imported

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);