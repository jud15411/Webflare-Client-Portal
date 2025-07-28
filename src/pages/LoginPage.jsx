// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './LoginPage.css'; // Import the new stylesheet

export default function LoginPage() {
  const [step, setStep] = useState('enterEmail');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/client/check-email', { email });
      if (data.status === 'needs_password_setup') {
        setStep('setPassword');
      } else if (data.status === 'ready_to_login') {
        setStep('enterPassword');
      }
    } catch (err) {
      console.error("Email check failed:", err.response || err);
      setError('No account found with this email address.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/client/set-password', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Set password failed:", err.response || err);
      setError('Could not set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/client/login', { email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login API call failed:", err.response || err); 
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Client Portal</h2>
          <p>Sign in to access your projects.</p>
        </div>

        {/* Email Entry Form */}
        {step === 'enterEmail' && (
          <form onSubmit={handleEmailCheck} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Set Initial Password Form */}
        {step === 'setPassword' && (
          <form onSubmit={handleSetPassword} className="login-form">
            <div className="form-group">
                <p>Welcome! Please create a password for your account.</p>
                <label htmlFor="password">Create Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                    placeholder="Enter at least 8 characters"
                />
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Create Account & Login'}
            </button>
          </form>
        )}

        {/* Standard Login Form */}
        {step === 'enterPassword' && (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}