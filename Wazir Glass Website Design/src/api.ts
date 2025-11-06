// src/api.ts
import axios from 'axios';

// This is the URL of your backend server
const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// This is the magic part:
// We add an "interceptor" that runs before *every* request.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('adminToken');
    if (token) {
      // If the token exists, add it to the 'Authorization' header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;