import axios from 'axios';

// We remove the hard-coded API_URL.
// The baseURL is now just "/", which points to the same domain (your Netlify site).
// Netlify's proxy will catch any requests starting with /api/ (based on your netlify.toml)
// and forward them to your Render backend.
const api = axios.create({
  baseURL: '/',
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
