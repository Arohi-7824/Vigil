import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api"
});

// Attach logged-in user email
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.email) {
    config.headers["x-user-email"] = user.email;
  }

  return config;
});

export const getRisks = () => api.get("/risks");

export const createRisk = (formData) =>
  api.post("/risks", formData);

export const resolveRisk = (id, status) =>
  api.put(`/risks/${id}/resolve`, { status });

export default api;