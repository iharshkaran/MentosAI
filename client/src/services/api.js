import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

if (!API_BASE_URL) {
  throw new Error("Missing VITE_API_BASE_URL. Set it to the deployed API URL in your Vercel project settings.");
}

const api = axios.create({
    baseURL: API_BASE_URL,
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

export const verifyLedgerJob = async (jobId, getToken) => {
  const token = await getToken();
  const response = await api.get(`/api/ledger/verify/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getSettings = async (getToken) => {
  const token = await getToken();
  const response = await api.get("/api/settings", { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const updateSettings = async (settings, getToken) => {
  const token = await getToken();
  const response = await api.put("/api/settings", settings, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const saveOutputEdit = async (jobId, type, content, getToken) => {
  const token = await getToken();
  const response = await api.put(`/api/jobs/${jobId}/outputs/${type}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
  return response.data.output;
};

export const reviseOutput = async (jobId, type, instruction, getToken) => {
  const token = await getToken();
  const response = await api.post(`/api/jobs/${jobId}/outputs/${type}/revise`, { instruction }, { headers: { Authorization: `Bearer ${token}` } });
  return response.data.output;
};

export const downloadOutput = async (jobId, type, getToken) => {
  const token = await getToken();
  const response = await api.get(`/api/jobs/${jobId}/outputs/${type}/download`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return response.data;
};

export default api;
