import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { ProductionLine, CockpitStats } from '../../types';

export const useCockpitStats = () => {
    const [stats, setStats] = useState<CockpitStats>({
        totalLines: 0,
        activeLines: 0,
        totalUsers: 0,
        totalPrefixes: 0,
        totalDepartments: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const delay = new Promise(resolve => setTimeout(resolve, 1800));

            const [linesResponse, deptsResponse] = await Promise.all([
                api.get<ProductionLine[]>(`${API_ENDPOINTS.ADMIN_COCKPIT.GET_ALL_PRODUCTION_LINES}?includeInactive=true`),
                api.get('/actions-panel').catch(() => ({ data: [] })),
                delay
            ]);

            const lines = linesResponse.data;
            const activeLinesCount = lines.filter(line => line.isActive).length;
            const uniquePrefixesCount = [...new Set(lines.map(line => line.prefix))].length;
            const departmentsCount = Array.isArray(deptsResponse.data) ? deptsResponse.data.length : 0;

            setStats({
                totalLines: lines.length,
                activeLines: activeLinesCount,
                totalUsers: 0,
                totalPrefixes: uniquePrefixesCount,
                totalDepartments: departmentsCount
            });
        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
            Alert.error("Erro ao carregar dados", "Não foi possível atualizar as estatísticas do cockpit.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, refetch: fetchStats };
};