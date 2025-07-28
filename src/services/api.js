// src/services/api.js
import axios from 'axios';

// Create an instance of axios with the base URL from the environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// This is an interceptor. It runs BEFORE each request is sent.
// It automatically adds the 'Authorization' header if a token exists.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;