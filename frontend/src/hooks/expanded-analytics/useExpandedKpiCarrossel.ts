import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { DowntimeDashboardDto, DashboardFilterParams, KpiItem } from '../../types';

interface UseExpandedKpiCarrosselParams {
    globalData: DowntimeDashboardDto | null;
    filters: DashboardFilterParams;
}

export const useExpandedKpiCarrossel = ({ globalData, filters }: UseExpandedKpiCarrosselParams) => {
    const [expandedData, setExpandedData] = useState<DowntimeDashboardDto | null>(null);

    useEffect(() => {
        const fetchExpandedData = async () => {
            try {
                const endpoint = filters.startDate
                    ? API_ENDPOINTS.ANALYTICS.DOWNTIME_DASHBOARD_EXPANDED_HISTORICAL
                    : API_ENDPOINTS.ANALYTICS.DOWNTIME_DASHBOARD_EXPANDED_LIVE;

                const response = await api.get<DowntimeDashboardDto>(endpoint, { params: filters });
                setExpandedData(response.data);
            } catch (error) {
                console.error("Erro ao buscar sparklines do carrossel:", error);
            }
        };
        fetchExpandedData();
    }, [filters]);

    const baseKpiList = useMemo((): KpiItem[] => {
        const source = expandedData || globalData;

        return [
            {
                label: "Total Tickets",
                value: source?.globalAnalytics?.totalTickets ?? 0,
                series: source?.timeSeriesAnalytics ?? [],
                dataKey: "ticketCount"
            },
            {
                label: "Em Aberto",
                value: source?.globalAnalytics?.openTickets ?? 0,
                series: source?.openTicketsSeries ?? [],
                dataKey: "value"
            },
            {
                label: "Tempo Resposta",
                value: `${source?.globalAnalytics?.averageResponseTimeMinutes.toFixed(1) ?? 0} min`,
                series: source?.responseTimeSeries ?? [],
                dataKey: "value"
            },
            {
                label: "Atendimento",
                value: `${source?.globalAnalytics?.averageResolutionTimeMinutes.toFixed(1) ?? 0} min`,
                series: source?.responseTimeSeries ?? [],
                dataKey: "value"
            },
            {
                label: "Impacto Parada",
                value: `${source?.globalAnalytics?.totalDowntimeHours.toFixed(1) ?? 0} hrs`,
                series: source?.downtimeSeries ?? [],
                dataKey: "value"
            }
        ];
    }, [expandedData, globalData]);

    const extendedKpiList = useMemo(() => {
        return [...baseKpiList, ...baseKpiList, ...baseKpiList, ...baseKpiList];
    }, [baseKpiList]);

    return { extendedKpiList };
};