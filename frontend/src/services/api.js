import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

// ✅ attach logged-in user email from localStorage
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.email) {
    config.headers["x-user-email"] = user.email;
  }

  return config;
});

/* ========================= */
/* ✅ EXPORT FUNCTIONS */
/* ========================= */

export const getRisks = () => api.get("/risks");


export const createRisk = (data) =>
  fetch(`${BASE_URL}/risks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

export const resolveRisk = (id) =>
  api.put(`/risks/${id}/resolve`);

export default api;