import axios from 'axios';

// Get the backend URL from the environment variable
const API_URL = process.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Your interceptor code (this is perfect, no changes needed)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
