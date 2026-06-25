import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { CurveType } from 'recharts/types/shape/Curve';
import type { ReactNode } from 'react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { useFullscreen } from '../expanded-analytics/useFullscreen';
import type { Department, RechartsValueType, DowntimeDashboardDto, DashboardFilterParams } from '../../types';

export const useLiveDowntimeDashboard = () => {
    const [data, setData] = useState<DowntimeDashboardDto | null>(null);
    const [loading, setLoading] = useState(true);
    const skipGlobalLoadingRef = useRef(false);
    
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [plantId] = useState<number>(1);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentId, setDepartmentId] = useState<string>('');
    const [lineType, setLineType] = useState<CurveType>('monotone');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

    const currentShiftLabel = useMemo(() => {
        const now = new Date();
        const time = now.getHours() + now.getMinutes() / 60;
        return (time >= 7.466 && time < 17.466) ? 'TURNO ADM' : 'TURNO 2';
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get<Department[]>(API_ENDPOINTS.DEPARTMENTS.BASE);
                setDepartments(response.data.filter(d => d.isActive));
            } catch (error) {
                console.error("Erro ao buscar departamentos:", error);
            }
        };
        fetchDepartments();
    }, []);

    const fetchMetrics = useCallback(async () => {
        try {
            if (!skipGlobalLoadingRef.current) setLoading(true);

            const params: Record<string, string | number> = { plantId };
            if (departmentId !== '') params.departmentId = Number(departmentId);

            const response = await api.get<DowntimeDashboardDto>(API_ENDPOINTS.ANALYTICS.DOWNTIME_DASHBOARD_LIVE, { params });
            setData(response.data);
        } catch (error) {
            console.error("Erro ao buscar analytics live:", error);
        } finally {
            setLoading(false);
            skipGlobalLoadingRef.current = false;
        }
    }, [plantId, departmentId]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const formatChartDate = useCallback((val: string | number) => {
        try {
            const d = new Date(String(val));
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        } catch { return String(val); }
    }, []);

    const formatTooltipLabel = useCallback((val: ReactNode) => {
        try {
            const d = new Date(String(val));
            return `Horário: ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        } catch { return String(val); }
    }, []);

    const formatTooltipValue = useCallback((value: RechartsValueType): [string, string] => {
        const safeValue = Array.isArray(value) ? value[0] : value;
        return [`${safeValue ?? 0} Tickets`, 'Volume'];
    }, []);

    const toggleLineType = useCallback(() => {
        setLineType((prev: CurveType) => prev === 'monotone' ? 'linear' : 'monotone');
    }, []);

    const carrosselFilters: DashboardFilterParams = useMemo(() => ({
        preset: 'realtime',
        plantId,
        departmentId: departmentId !== '' ? Number(departmentId) : undefined
    }), [plantId, departmentId]);

    return {
        data, loading, isBackHovered, setIsBackHovered,
        departments, departmentId, setDepartmentId,
        lineType, toggleLineType, currentShiftLabel,
        containerRef, isFullscreen, toggleFullscreen,
        carrosselFilters, fetchMetrics,
        chartFormatters: { formatChartDate, formatTooltipLabel, formatTooltipValue }
    };
};