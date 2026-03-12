import axios from "axios";

/**
 * Base URL configuration:
 * In production (Vercel), it uses the environment variable VITE_API_URL.
 * In development, it falls back to localhost:5000.
 */
const api = axios.create({
  // כתובת ישירה ל-Render - בלי להסתמך על משתני סביבה לרגע
  baseURL: "https://craftix-backend.onrender.com/api",
});

// Automatically add the JWT token to every request if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
