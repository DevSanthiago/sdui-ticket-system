import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import type { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type {
    ApiErrorResponse, ProductionLine, ProductionLinesByPrefix, ProductionLineAction
} from '../../types';

export const useProductionLinesPage = (isDarkMode: boolean) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isDarkModeRef = useRef(isDarkMode);
    useEffect(() => { isDarkModeRef.current = isDarkMode; }, [isDarkMode]);

    const [linesByPrefix, setLinesByPrefix] = useState<ProductionLinesByPrefix[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);
    const [includeInactive, setIncludeInactive] = useState(false);

    const fetchLines = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const request = api.get<ProductionLinesByPrefix[]>(
                `${API_ENDPOINTS.ADMIN_COCKPIT.PRODUCTION_LINES_BY_PREFIX}?includeInactive=${includeInactive}`
            );
            const [response] = silent
                ? [await request]
                : await Promise.all([request, new Promise(resolve => setTimeout(resolve, 1800))]);
            setLinesByPrefix(response.data);
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Ocorreu um erro inesperado", "error", isDarkModeRef.current);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [includeInactive]);

    useEffect(() => {
        fetchLines();
    }, [fetchLines]);

    const handleCreateLine = () => {
        setSelectedLine(null);
        onOpen();
    };

    const handleEditLine = (line: ProductionLine) => {
        setSelectedLine(line);
        onOpen();
    };

    const handleActionLine = async (line: ProductionLine, action: ProductionLineAction) => {
        const isDeactivate = action === 'deactivate';
        const title = isDeactivate ? 'Desativar Linha' : 'Excluir Linha';
        const message = isDeactivate
            ? `Tem certeza que deseja desativar a linha ${line.lineName}?`
            : `Esta ação é irreversível. Deseja excluir permanentemente a linha ${line.lineName}?`;

        const result = await Alert.confirm(title, message, isDarkMode);

        if (result.isConfirmed) {
            try {
                if (isDeactivate) {
                    await api.post(API_ENDPOINTS.ADMIN_COCKPIT.DEACTIVATE_PRODUCTION_LINE(line.id));
                    Alert.toast("Linha desativada com sucesso", "success", isDarkMode);
                } else {
                    await api.delete(API_ENDPOINTS.ADMIN_COCKPIT.DELETE_PRODUCTION_LINE(line.id));
                    Alert.toast("Linha excluída com sucesso", "success", isDarkMode);
                }
                fetchLines(true);
            } catch (error) {
                const err = error as AxiosError<ApiErrorResponse>;
                Alert.toast(err.response?.data?.message || "Ocorreu um erro", "error", isDarkMode);
            }
        }
    };

    const handleActivateLine = async (line: ProductionLine) => {
        try {
            await api.post(API_ENDPOINTS.ADMIN_COCKPIT.ACTIVATE_PRODUCTION_LINE(line.id));
            Alert.toast("Linha ativada com sucesso", "success", isDarkMode);
            fetchLines(true);
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Ocorreu um erro", "error", isDarkMode);
        }
    };

    const handleModalSuccess = () => {
        onClose();
        fetchLines(true);
    };

    const filteredLinesByPrefix = useMemo(() => {
        return linesByPrefix
            .map(group => ({
                ...group,
                lines: group.lines.filter(line =>
                    line.lineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    line.prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    line.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }))
            .filter(group => group.lines.length > 0);
    }, [linesByPrefix, searchTerm]);

    return {
        loading,
        searchTerm, setSearchTerm,
        selectedLine,
        includeInactive, setIncludeInactive,
        filteredLinesByPrefix,
        isOpen, onClose,
        handleCreateLine,
        handleEditLine,
        handleActionLine,
        handleActivateLine,
        handleModalSuccess,
    };
};