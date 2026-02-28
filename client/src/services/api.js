import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// later: attach token here
api.interceptors.request.use((config) => {
  return config;
});

export default api;
