import { useMemo } from 'react';
import { SUMMARY_BUILDER_CONSTANTS } from '../../constants/admin/summaryBuilderConstants';
import { useColorModeValue } from '../theme/useColorModeValue';
import type { FormFieldSchema, DepartmentConfigSummary, MockTicket } from '../../types';

interface UseSummaryBuilderArgs {
    fields: FormFieldSchema[];
    summaryFields: string[];
    onChange: (selectedIds: string[]) => void;
    departmentConfig: DepartmentConfigSummary;
}

export const useSummaryBuilder = ({ fields, summaryFields, onChange, departmentConfig }: UseSummaryBuilderArgs) => {
    const isDarkMode = useColorModeValue(false, true);

    const eligibleFields = useMemo(() => {
        return fields.filter(f => !SUMMARY_BUILDER_CONSTANTS.EXCLUDED_FIELD_TYPES.includes(f.type));
    }, [fields]);

    const isMaxLimitReached = summaryFields.length >= SUMMARY_BUILDER_CONSTANTS.MAX_SELECTION_LIMIT;

    const handleToggleField = (fieldId: string) => {
        if (summaryFields.includes(fieldId)) {
            onChange(summaryFields.filter(id => id !== fieldId));
            return;
        } 
        
        if (!isMaxLimitReached) {
            onChange([...summaryFields, fieldId]);
        }
    };

    const previewTicket = useMemo<MockTicket>(() => {
        const { MOCK } = SUMMARY_BUILDER_CONSTANTS;

        const dynamicFields = summaryFields.map(id => {
            const field = eligibleFields.find(f => f.id === id);
            return {
                id: id,
                label: field?.label || MOCK.DEFAULT_FIELD_LABEL,
                value: MOCK.DEFAULT_FIELD_VALUE,
                rawValue: MOCK.DEFAULT_FIELD_VALUE
            };
        });

        const fallbackDynamicFields = [{ 
            id: 'preview-empty',
            label: MOCK.EMPTY_SUMMARY_LABEL, 
            value: MOCK.EMPTY_SUMMARY_VALUE,
            rawValue: MOCK.EMPTY_SUMMARY_VALUE
        }];

        return {
            id: MOCK.TICKET_ID,
            departmentName: departmentConfig.name || MOCK.DEFAULT_DEPARTMENT_NAME,
            departmentColor: departmentConfig.cardColorHex || (isDarkMode ? MOCK.DEFAULT_DARK_COLOR : MOCK.DEFAULT_LIGHT_COLOR),
            lineName: MOCK.DEFAULT_LINE_NAME,
            openedBy: MOCK.DEFAULT_OPERATOR,
            openedAt: new Date().toLocaleDateString('pt-BR') + ', 14:30',
            isLineStopped: false,
            status: MOCK.DEFAULT_STATUS,
            dynamicFields: dynamicFields.length > 0 ? dynamicFields : fallbackDynamicFields
        };
    }, [summaryFields, eligibleFields, departmentConfig, isDarkMode]);

    return {
        eligibleFields,
        previewTicket,
        isMaxLimitReached,
        handleToggleField,
        currentSelectionCount: summaryFields.length,
        maxSelectionLimit: SUMMARY_BUILDER_CONSTANTS.MAX_SELECTION_LIMIT
    };
};