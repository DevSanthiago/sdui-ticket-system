import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import type { CurveType } from 'recharts/types/shape/Curve';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type {
    DowntimeDashboardDto, DashboardFilterParams, Department, DateRangeState
} from '../../types';

export const useDowntimeHistorical = () => {
    const [data, setData] = useState<DowntimeDashboardDto | null>(null);
    const [loading, setLoading] = useState(true);
    const skipGlobalLoadingRef = useRef(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const [startDate, setStartDate] = useState(format(lastWeek, 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(today, 'yyyy-MM-dd'));
    const [plantId] = useState<number>(1);

    const [showCalendar, setShowCalendar] = useState(false);
    const [rangeState, setRangeState] = useState<DateRangeState[]>([
        { startDate: lastWeek, endDate: today, key: 'selection' }
    ]);

    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentId, setDepartmentId] = useState<string>('');
    const [activeShiftFilter, setActiveShiftFilter] = useState<string>('');
    const [groupBy, setGroupBy] = useState<DashboardFilterParams['groupBy']>('day');
    const [lineType, setLineType] = useState<CurveType>('monotone');

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

    const computeGroupBy = (start: Date, end: Date): DashboardFilterParams['groupBy'] => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 60) return 'month';
        if (diffDays > 14) return 'day';
        return 'hour';
    };

    const handleShiftFilterChange = (filterValue: string) => {
        skipGlobalLoadingRef.current = true;
        setActiveShiftFilter(filterValue);

        if (filterValue !== '') {
            setGroupBy('hour');
        } else {
            setGroupBy(computeGroupBy(rangeState[0].startDate, rangeState[0].endDate));
        }
    };

    const fetchMetrics = useCallback(async () => {
        try {
            if (!skipGlobalLoadingRef.current) setLoading(true);

            const params: DashboardFilterParams = { startDate, endDate, plantId, groupBy };
            if (activeShiftFilter !== '') params.shift = activeShiftFilter;
            if (departmentId !== '') params.departmentId = Number(departmentId);

            const response = await api.get<DowntimeDashboardDto>(
                API_ENDPOINTS.ANALYTICS.DOWNTIME_DASHBOARD_HISTORICAL, { params }
            );
            setData(response.data);
        } catch (error) {
            console.error("Erro ao buscar analytics:", error);
        } finally {
            setLoading(false);
            skipGlobalLoadingRef.current = false;
        }
    }, [startDate, endDate, plantId, departmentId, groupBy, activeShiftFilter]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const handleCalendarClose = () => {
        const selectedStart = rangeState[0].startDate;
        const selectedEnd = rangeState[0].endDate;

        setStartDate(format(selectedStart, 'yyyy-MM-dd'));
        setEndDate(format(selectedEnd, 'yyyy-MM-dd'));
        setShowCalendar(false);

        if (activeShiftFilter === '') {
            setGroupBy(computeGroupBy(selectedStart, selectedEnd));
        }
    };

    const toggleLineType = useCallback(() => {
        setLineType((prev: CurveType) => prev === 'monotone' ? 'linear' : 'monotone');
    }, []);

    const carrosselFilters: DashboardFilterParams = {
        startDate, endDate, plantId,
        departmentId: departmentId !== '' ? Number(departmentId) : undefined,
        groupBy,
        shift: activeShiftFilter !== '' ? activeShiftFilter : undefined
    };

    return {
        data, loading,
        startDate, endDate,
        showCalendar, setShowCalendar,
        rangeState, setRangeState,
        departments, departmentId, setDepartmentId,
        activeShiftFilter,
        groupBy, lineType,
        carrosselFilters,
        handleShiftFilterChange,
        handleCalendarClose,
        fetchMetrics,
        toggleLineType,
    };
};