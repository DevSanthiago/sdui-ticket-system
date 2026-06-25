import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { useColorModeValue } from '../theme/useColorModeValue';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { ApiErrorResponse, CreateLinePrefixDto } from '../../types';

interface UsePrefixModalParams {
    isOpen: boolean;
    onSuccess: () => void;
}

export const usePrefixModal = ({ isOpen, onSuccess }: UsePrefixModalParams) => {
    const isDarkMode = useColorModeValue(false, true);
    const [formData, setFormData] = useState<CreateLinePrefixDto>({ value: "", label: "" });
    const [errors, setErrors] = useState({ value: "", label: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ value: "", label: "" });
            setErrors({ value: "", label: "" });
        }
    }, [isOpen]);

    useEffect(() => {
        const autoLabel = formData.value.trim() ? `Linhas ${formData.value.trim()}` : "";
        setFormData(prev => prev.label === autoLabel ? prev : { ...prev, label: autoLabel });
    }, [formData.value]);

    const handleSubmit = async () => {
        const newErrors = {
            value: !formData.value.trim() ? "O valor do prefixo é obrigatório" : "",
            label: !formData.label.trim() ? "O rótulo é obrigatório" : ""
        };

        setErrors(newErrors);
        if (newErrors.value || newErrors.label) return;

        try {
            setLoading(true);
            await api.post(API_ENDPOINTS.ADMIN_COCKPIT.CREATE_PREFIX, {
                value: formData.value.toUpperCase().trim(),
                label: formData.label.trim()
            });
            Alert.toast("Prefixo criado com sucesso!", "success", isDarkMode);
            onSuccess();
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Erro ao criar prefixo", "error", isDarkMode);
        } finally {
            setLoading(false);
        }
    };

    return { formData, setFormData, errors, loading, handleSubmit };
};