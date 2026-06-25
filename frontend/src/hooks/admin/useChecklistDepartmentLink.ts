import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { Department, FormFieldSchema, FormFieldOption } from '../../types';

const TRIGGERABLE_TYPES = new Set<FormFieldSchema['type']>(['select', 'card_radio', 'button_group']);

export const useChecklistDepartmentLink = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const response = await api.get<Department[]>(
                    `${API_ENDPOINTS.ACTIONS_PANEL.GET_ALL}?includeInactive=true`
                );
                if (active) setDepartments(response.data || []);
            } catch (error) {
                console.error('Falha ao carregar departamentos para vínculo de checklist', error);
                if (active) setDepartments([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    const getTriggerableFields = useCallback((departmentId: number | null): FormFieldSchema[] => {
        if (departmentId == null) return [];
        const dept = departments.find(d => d.id === departmentId);
        const fields = dept?.formSchema?.fields ?? [];
        return fields.filter(f => TRIGGERABLE_TYPES.has(f.type) && (f.options?.length ?? 0) > 0);
    }, [departments]);

    const getFieldOptions = useCallback((departmentId: number | null, fieldId: string | null): FormFieldOption[] => {
        if (departmentId == null || !fieldId) return [];
        const field = getTriggerableFields(departmentId).find(f => f.id === fieldId);
        return field?.options ?? [];
    }, [getTriggerableFields]);

    return { departments, loading, getTriggerableFields, getFieldOptions };
};
