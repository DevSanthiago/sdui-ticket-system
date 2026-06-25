import { useState, useEffect } from 'react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { LinePrefix, ProductionLinesByPrefix, DynamicFieldValue } from '../../types';

interface UseDynamicLocationParams {
    fieldId: string;
    fieldType: string;
    onChange: (fieldId: string, value: DynamicFieldValue) => void;
}

export const useDynamicLocation = ({ fieldId, fieldType, onChange }: UseDynamicLocationParams) => {
    const [dbPrefixes, setDbPrefixes] = useState<LinePrefix[]>([]);
    const [dbGroupedLines, setDbGroupedLines] = useState<ProductionLinesByPrefix[]>([]);
    const [selectedPrefix, setSelectedPrefix] = useState<string>('');

    useEffect(() => {
        if (fieldType !== 'dynamic_location') return;

        const fetchDbData = async () => {
            try {
                const [prefixesRes, linesRes] = await Promise.all([
                    api.get<LinePrefix[]>(API_ENDPOINTS.ADMIN_COCKPIT.GET_PREFIXES),
                    api.get<ProductionLinesByPrefix[]>(API_ENDPOINTS.ADMIN_COCKPIT.PRODUCTION_LINES_BY_PREFIX)
                ]);
                if (prefixesRes.data) setDbPrefixes(prefixesRes.data);
                if (linesRes.data) setDbGroupedLines(linesRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDbData();
    }, [fieldType]);

    const handlePrefixChange = (prefix: string) => {
        setSelectedPrefix(prefix);
        onChange(fieldId, '');
    };

    return { dbPrefixes, dbGroupedLines, selectedPrefix, handlePrefixChange };
};