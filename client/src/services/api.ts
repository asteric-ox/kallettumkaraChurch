import axios from 'axios';

// In production (Cloudflare Pages): VITE_API_BASE_URL = https://your-app.onrender.com/api
// In local dev: falls back to '/api' which Vite proxy forwards to localhost:5000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('church_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
