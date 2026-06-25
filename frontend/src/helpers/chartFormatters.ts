import type { ReactNode } from 'react';
import type { RechartsValueType } from '../types';
import type { DashboardFilterParams } from '../types';

type GroupBy = DashboardFilterParams['groupBy'];

export const formatChartDate = (val: string | number, groupBy: GroupBy): string => {
    try {
        const d = new Date(String(val));
        if (groupBy === 'minute') return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        if (groupBy === 'hour') return `${d.getHours().toString().padStart(2, '0')}h`;
        if (groupBy === 'month') return `${('0' + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear().toString().slice(-2)}`;
        return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}`;
    } catch {
        return String(val);
    }
};

export const formatTooltipLabel = (val: ReactNode, groupBy: GroupBy): string => {
    try {
        const d = new Date(String(val));
        if (groupBy === 'minute') return `Horário: ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        if (groupBy === 'hour') return `Data: ${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)} às ${d.getHours().toString().padStart(2, '0')}h`;
        return `Data: ${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}`;
    } catch {
        return String(val);
    }
};

export const formatTooltipValue = (value: RechartsValueType): [string, string] => {
    const safeValue = Array.isArray(value) ? value[0] : value;
    return [`${safeValue ?? 0} Tickets`, 'Volume'];
};