import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { ALLOWED_FILTER_TYPES } from '../../constants/tickets/ticketFilterConstants';
import type { ProductionLine, FormFieldSchema, FormFieldOption, Department } from '../../types';
import type { Range } from 'react-date-range';

interface UseTicketFilterDrawerParams {
    isOpen: boolean;
    isDark: boolean;
    searchQuery: string;
    dynamicFilters: Record<string, string>;
    departments: Department[];
    startDate: string;
    endDate: string;
    onSearchChange: (query: string) => void;
    onDynamicFilterChange: (fieldId: string, value: string) => void;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onClearFilters: () => void;
    onClose: () => void;
    theme: Record<string, string>;
}

export const useTicketFilterDrawer = ({
    isOpen, isDark, searchQuery, dynamicFilters, departments,
    startDate, endDate, onSearchChange, onDynamicFilterChange,
    onStartDateChange, onEndDateChange, onClearFilters, onClose, theme
}: UseTicketFilterDrawerParams) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isClearHovered, setIsClearHovered] = useState(false);
    const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [localDynamicFilters, setLocalDynamicFilters] = useState<Record<string, string>>(dynamicFilters);
    const [rangeState, setRangeState] = useState<Range[]>([{
        startDate: startDate ? new Date(startDate + 'T00:00:00') : new Date(),
        endDate: endDate ? new Date(endDate + 'T00:00:00') : new Date(),
        key: 'selection'
    }]);

    useEffect(() => {
    if (!isOpen) return;

    setLocalSearchQuery(searchQuery);
    setLocalDynamicFilters(dynamicFilters);
    setRangeState([{
        startDate: startDate ? new Date(startDate + 'T00:00:00') : new Date(),
        endDate: endDate ? new Date(endDate + 'T00:00:00') : new Date(),
        key: 'selection'
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isOpen]);

    useEffect(() => {
    if (!isOpen) return;

    const fetchProductionLines = async () => {
        try {
            const response = await api.get<ProductionLine[]>(
                API_ENDPOINTS.ADMIN_COCKPIT.GET_ALL_PRODUCTION_LINES
            );
            const sortedLines = [...response.data].sort((a, b) =>
                a.lineName.localeCompare(b.lineName, 'pt-BR', { numeric: true })
            );
            setProductionLines(sortedLines);
        } catch {
            console.error("Erro ao buscar linhas de produção");
        }
    };

    fetchProductionLines();
    }, [isOpen]);

    const filterableFields = useMemo(() => {
        const fieldsMap = new Map<string, FormFieldSchema>();

        departments.forEach((dept) => {
            if (!dept.formSchema) return;
            let schemaObj = dept.formSchema;

            if (typeof schemaObj === 'string') {
                try { schemaObj = JSON.parse(schemaObj); } catch { return; }
            }

            if (Array.isArray(schemaObj?.fields)) {
                schemaObj.fields.forEach((field: FormFieldSchema) => {
                    if (!ALLOWED_FILTER_TYPES.includes(field.type as typeof ALLOWED_FILTER_TYPES[number])) return;

                    if (!fieldsMap.has(field.id)) {
                        fieldsMap.set(field.id, {
                            id: field.id, label: field.label,
                            type: field.type,
                            options: field.options ? [...field.options] : []
                        } as FormFieldSchema);
                    } else {
                        const existingField = fieldsMap.get(field.id);
                        if (existingField && field.options) {
                            field.options.forEach((opt: FormFieldOption) => {
                                if (!existingField.options?.some((eo) => eo.value === opt.value)) {
                                    existingField.options?.push(opt);
                                }
                            });
                        }
                    }
                });
            }
        });

        return Array.from(fieldsMap.values());
    }, [departments]);

    const getDisplayDate = () => {
        const start = rangeState[0]?.startDate;
        const end = rangeState[0]?.endDate;
        if (start && end) {
            const startStr = format(start, 'dd/MM/yyyy');
            const endStr = format(end, 'dd/MM/yyyy');
            return startStr === endStr ? startStr : `${startStr} até ${endStr}`;
        }
        return "Selecione o período...";
    };

    const getPillProps = (isActive: boolean) => {
        const activeGlow = isDark ? "0 0 10px rgba(255, 255, 255, 0.4)" : "0 0 8px rgba(0, 0, 0, 0.15)";
        const hoverGlow = isDark ? "0 0 10px rgba(255, 255, 255, 0.2)" : "0 0 8px rgba(0, 0, 0, 0.1)";

        return {
            borderRadius: "full", px: 4, size: "sm",
            fontWeight: "bold", variant: "outline",
            bg: isActive ? (isDark ? "whiteAlpha.200" : "blackAlpha.100") : theme.cardBg,
            color: isActive ? theme.textPrimary : theme.textSecondary,
            borderColor: isActive ? theme.textPrimary : theme.cardBorder,
            boxShadow: isActive ? activeGlow : "none",
            _hover: {
                borderColor: isActive ? theme.textPrimary : (isDark ? "whiteAlpha.400" : "blackAlpha.300"),
                bg: isActive ? (isDark ? "whiteAlpha.300" : "blackAlpha.200") : (isDark ? "whiteAlpha.50" : "blackAlpha.50"),
                boxShadow: isActive ? activeGlow : hoverGlow,
            },
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        };
    };

    const hasActiveFilters = localSearchQuery !== '' || startDate !== '' || endDate !== ''
        || Object.values(localDynamicFilters).some(val => val !== '');

    const handleApply = () => {
        if (rangeState[0].startDate) onStartDateChange(format(rangeState[0].startDate, 'yyyy-MM-dd'));
        if (rangeState[0].endDate) onEndDateChange(format(rangeState[0].endDate, 'yyyy-MM-dd'));
        onSearchChange(localSearchQuery);
        Object.entries(localDynamicFilters).forEach(([key, value]) => {
            onDynamicFilterChange(key, value);
        });
        onClose();
    };

    const handleClear = () => {
        onClearFilters();
        onClose();
    };

    const groupedLines = useMemo(() => {
        return productionLines.reduce<Record<string, ProductionLine[]>>((acc, pl) => {
            const prefix = pl.prefix || 'Outros';
            if (!acc[prefix]) acc[prefix] = [];
            acc[prefix].push(pl);
            return acc;
        }, {});
    }, [productionLines]);

    return {
        showCalendar, setShowCalendar,
        isClearHovered, setIsClearHovered,
        localSearchQuery, setLocalSearchQuery,
        localDynamicFilters, setLocalDynamicFilters,
        rangeState, setRangeState,
        filterableFields, groupedLines,
        hasActiveFilters,
        getDisplayDate, getPillProps,
        handleApply, handleClear,
    };
};