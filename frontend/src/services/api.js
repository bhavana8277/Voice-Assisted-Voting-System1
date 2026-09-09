import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
  const officer = JSON.parse(localStorage.getItem("officer") || "null");
  if (officer?.accessToken) {
    config.headers.Authorization = `Bearer ${officer.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("officer");
      window.location.assign("/");
    }
    return Promise.reject(error);
  },
);

export default api;
