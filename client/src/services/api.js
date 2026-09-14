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

export default api;