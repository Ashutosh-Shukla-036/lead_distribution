import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token from sessionStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const saved = sessionStorage.getItem("authState");
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
