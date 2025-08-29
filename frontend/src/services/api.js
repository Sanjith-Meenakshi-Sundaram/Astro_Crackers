import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically. Owner token has priority.
api.interceptors.request.use((config) => {
  try {
    const ownerToken = localStorage.getItem("ownerToken");
    const userToken = localStorage.getItem("userToken");
    const token = ownerToken || userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // no-op
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
