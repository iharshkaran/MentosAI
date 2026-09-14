import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { generateContent } from "../services/api";

export const useGenerate = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const generate = async ({ file, sourceType, rawText, outputTypes, config }) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            if (file) formData.append("files", file);
            formData.append("sourceType", sourceType);
            if (rawText) formData.append("rawText", rawText);
            formData.append("outputTypes", JSON.stringify(outputTypes));
            formData.append("config", JSON.stringify(config));

            const data = await generateContent(formData, getToken);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading, result, error };
};