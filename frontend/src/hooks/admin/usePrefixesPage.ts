import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { ApiErrorResponse, LinePrefix } from '../../types';

export const usePrefixesPage = (isDarkMode: boolean) => {
    const [prefixes, setPrefixes] = useState<LinePrefix[]>([]);
    const [loading, setLoading] = useState(true);

    const isDarkModeRef = useRef(isDarkMode);
    useEffect(() => { isDarkModeRef.current = isDarkMode; }, [isDarkMode]);

    const fetchPrefixes = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const request = api.get(API_ENDPOINTS.ADMIN_COCKPIT.GET_PREFIXES);
            const [response] = silent
                ? [await request]
                : await Promise.all([request, new Promise(resolve => setTimeout(resolve, 1800))]);
            setPrefixes(response.data);
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Erro ao carregar prefixos", "error", isDarkModeRef.current);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrefixes();
    }, [fetchPrefixes]);

    const handleDeleteClick = async (prefix: LinePrefix) => {
        const result = await Alert.confirm(
            "Excluir Prefixo",
            `Tem certeza que deseja excluir o prefixo ${prefix.value}? Esta ação só é permitida se não houver linhas vinculadas.`,
            isDarkMode
        );

        if (result.isConfirmed) {
            try {
                await api.delete(API_ENDPOINTS.ADMIN_COCKPIT.DELETE_PREFIX(prefix.id));
                Alert.toast("Prefixo removido com sucesso!", "success", isDarkMode);
                fetchPrefixes(true);
            } catch (error) {
                const err = error as AxiosError<ApiErrorResponse>;
                Alert.toast(
                    err.response?.data?.message || "O prefixo pode estar em uso ou ocorreu um erro na API.",
                    "error", isDarkMode
                );
            }
        }
    };

    return { prefixes, loading, fetchPrefixes, handleDeleteClick };
};