import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { generateContent } from "../services/api";

export const useGenerate = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [clarification, setClarification] = useState(null);

    const generate = async ({
        file,
        sourceType,
        rawText,
        outputTypes,
        config,
        jobId,
        overrideClarification,
        clarificationAnswers,
    }) => {
        setLoading(true);
        setError(null);
        if (!jobId) {
            setResult(null);
            setClarification(null);
        }

        try {
            const formData = new FormData();
            if (file) formData.append("files", file);
            formData.append("sourceType", sourceType);
            if (rawText) formData.append("rawText", rawText);
            formData.append("outputTypes", JSON.stringify(outputTypes));
            formData.append("config", JSON.stringify(config));
            if (jobId) formData.append("jobId", jobId);
            if (overrideClarification) formData.append("overrideClarification", "true");
            if (clarificationAnswers) formData.append("clarificationAnswers", clarificationAnswers);

            const data = await generateContent(formData, getToken);
            if (data?.status === "clarification_needed") {
                setClarification(data);
                setResult(null);
                return data;
            }
            setClarification(null);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { generate, loading, result, error, clarification, setClarification };
};
