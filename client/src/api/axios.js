import axios from "axios";

/**
 * Base URL configuration:
 * In production (AWS), it uses the environment variable VITE_API_URL.
 * In development, it falls back to localhost:5000.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
