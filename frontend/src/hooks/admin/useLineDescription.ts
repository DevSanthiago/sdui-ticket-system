import { useMemo } from 'react';

export const useLineDescription = (lineName: string, prefix: string): string => {
    return useMemo(() => {
        const parts = [prefix?.trim(), lineName?.trim()].filter(Boolean);
        if (parts.length === 0) return '';
        return `Linha de produção ${parts.join(' ')}`;
    }, [lineName, prefix]);
};
