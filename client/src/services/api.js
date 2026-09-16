import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

export const generateContent = async (formData, getToken) => {
    const token = await getToken();
    const response = await api.post("/api/generate", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getJobs = async (getToken) => {
  const token = await getToken();
  const response = await api.get("/api/jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getJobById = async (id, getToken) => {
  const token = await getToken();
  const response = await api.get(`/api/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;