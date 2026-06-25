import { useState, useEffect } from 'react';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { AvailableRoleOption } from '../../types';

export const useRolesBuilder = (isDarkMode: boolean) => {
    const [availableRoles, setAvailableRoles] = useState<AvailableRoleOption[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);

    const orangeNeon = "#ED8936";
    const greenNeon = "#48BB78";
    const redNeon = "#F56565";
    const whiteNeon = "#FFFFFF";

    const glowOrange = `drop-shadow(0 0 8px ${orangeNeon})`;
    const glowGreen = `drop-shadow(0 0 8px ${greenNeon})`;
    const glowRed = `drop-shadow(0 0 8px ${redNeon})`;
    const textGlowOrange = isDarkMode ? `0 0 10px ${orangeNeon}` : 'none';

    const neonOutlineThin = [
        `0 0 1px ${whiteNeon}`,
        `inset 0 0 1px ${whiteNeon}`,
        `0 0 4px ${whiteNeon}33`
    ].join(', ');

    const activePillColor = isDarkMode ? "white" : "black";
    const activePillShadow = isDarkMode ? neonOutlineThin : "0 0 2px rgba(0, 0, 0, 0.3)";

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setIsLoadingRoles(true);
                const response = await api.get(API_ENDPOINTS.ROLES.AVAILABLE);
                setAvailableRoles(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar roles:", error);
                Alert.error("Erro de Conexão", "Não foi possível carregar a lista de cargos do Access Control.", isDarkMode);
                setAvailableRoles([]);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRoles();
    }, [isDarkMode]);

    const handleRemoveRole = (roleToRemove: string, allowedRoles: string[], onChange: (roles: string[]) => void) => {
        onChange(allowedRoles.filter(role => role !== roleToRemove));
    };

    const handleAddRole = (role: string, allowedRoles: string[], onChange: (roles: string[]) => void) => {
        if (!allowedRoles.includes(role)) {
            onChange([...allowedRoles, role]);
        }
    };

    return {
        availableRoles,
        isLoadingRoles,
        orangeNeon, greenNeon, redNeon,
        glowOrange, glowGreen, glowRed,
        textGlowOrange,
        activePillColor, activePillShadow,
        handleRemoveRole,
        handleAddRole,
    };
};