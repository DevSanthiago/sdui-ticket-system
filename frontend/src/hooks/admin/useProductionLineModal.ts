import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { Alert } from '../../services/alerts/alertService';
import { useLineDescription } from './useLineDescription';
import type { ApiErrorResponse, LinePrefix, ProductionLineModalProps, ProductionLineFormData, ProductionLineModalFormErrors } from '../../types';

type UseProductionLineModalParams = Pick<ProductionLineModalProps, 'isOpen' | 'onSuccess' | 'line'> & {
    isDarkMode: boolean;
};

export const useProductionLineModal = ({ isOpen, onSuccess, line, isDarkMode }: UseProductionLineModalParams) => {
    const [availablePrefixes, setAvailablePrefixes] = useState<LinePrefix[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<ProductionLineFormData>({
        lineName: "", prefix: "", description: "", isActive: true,
    });

    const [errors, setErrors] = useState<ProductionLineModalFormErrors>({
        lineName: "", prefix: "",
    });

    const autoDescription = useLineDescription(formData.lineName, formData.prefix);

    useEffect(() => {
        setFormData(prev => prev.description === autoDescription ? prev : { ...prev, description: autoDescription });
    }, [autoDescription]);

    useEffect(() => {
        const fetchPrefixes = async () => {
            try {
                const response = await api.get<LinePrefix[]>(API_ENDPOINTS.ADMIN_COCKPIT.GET_PREFIXES);
                setAvailablePrefixes(response.data);
            } catch (error) {
                const err = error as AxiosError;
                console.error("Erro ao carregar prefixos", err.message);
            }
        };

        if (isOpen) {
            fetchPrefixes();
            setFormData(line
                ? { lineName: line.lineName, prefix: line.prefix, description: line.description || "", isActive: line.isActive }
                : { lineName: "", prefix: "", description: "", isActive: true }
            );
            setErrors({ lineName: "", prefix: "" });
        }
    }, [isOpen, line]);

    const handleLineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setFormData(prev => ({ ...prev, lineName: value }));
        setErrors(prev => ({
            ...prev,
            lineName: !value.trim() ? "Nome da linha é obrigatório" : ""
        }));
    };

    const handleSubmit = async () => {
        const newErrors: ProductionLineModalFormErrors = {
            lineName: !formData.lineName.trim() ? "Nome da linha é obrigatório" : "",
            prefix: !formData.prefix ? "Prefixo é obrigatório" : "",
        };

        setErrors(newErrors);
        if (newErrors.lineName || newErrors.prefix) return;

        try {
            setLoading(true);

            if (line) {
                await api.put(API_ENDPOINTS.ADMIN_COCKPIT.UPDATE_PRODUCTION_LINE(line.id), {
                    lineName: formData.lineName.trim(),
                    prefix: formData.prefix,
                    description: formData.description?.trim() || null,
                    isActive: formData.isActive,
                });
                Alert.success("Sucesso", "Linha atualizada com sucesso!", isDarkMode);
            } else {
                await api.post(API_ENDPOINTS.ADMIN_COCKPIT.CREATE_PRODUCTION_LINE, {
                    lineName: formData.lineName.trim(),
                    prefix: formData.prefix,
                    description: formData.description?.trim() || null,
                });
                Alert.success("Sucesso", "Linha criada com sucesso!", isDarkMode);
            }
            onSuccess();
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            Alert.error(
                line ? "Erro ao atualizar" : "Erro ao criar",
                axiosError.response?.data?.message || "Erro de conexão com o servidor",
                isDarkMode
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        availablePrefixes, formData, setFormData,
        errors, loading,
        handleLineNameChange, handleSubmit,
    };
};