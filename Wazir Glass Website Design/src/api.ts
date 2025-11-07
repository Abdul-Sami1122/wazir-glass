import axios from 'axios';

// 
// *** THIS IS THE FINAL FIX ***
// Vite uses 'import.meta.env' NOT 'process.env'
//
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// This is the magic part:
// This code is perfect and doesn't need to change.
// It will run before *every* request.
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
