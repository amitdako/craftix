import axios from "axios";

// Creating a base instance for our API
const api = axios.create({
  baseURL: "http://localhost:5000/api", // This points to your Node.js server
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
