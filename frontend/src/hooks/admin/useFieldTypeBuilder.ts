import { useCallback, useState } from 'react';
import { createSlug } from '../../helpers/stringHelpers';
import type { FieldTemplate, FieldTemplateBaseType, FormFieldOption, CreateFieldTemplatePayload } from '../../types';

const INITIAL_BASE_TYPE: FieldTemplateBaseType = 'text';

export const useFieldTypeBuilder = () => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [baseType, setBaseType] = useState<FieldTemplateBaseType>(INITIAL_BASE_TYPE);
    const [label, setLabel] = useState('');
    const [required, setRequired] = useState(true);
    const [options, setOptions] = useState<FormFieldOption[]>([]);

    const hasOptions = baseType === 'select' || baseType === 'card_radio';

    const reset = useCallback(() => {
        setEditingId(null);
        setName('');
        setBaseType(INITIAL_BASE_TYPE);
        setLabel('');
        setRequired(true);
        setOptions([]);
    }, []);

    const loadTemplate = useCallback((template: FieldTemplate) => {
        setEditingId(template.id);
        setName(template.name);
        setBaseType(template.schema.baseType);
        setLabel(template.schema.label);
        setRequired(template.schema.required);
        setOptions(template.schema.options ? template.schema.options.map(opt => ({ ...opt })) : []);
    }, []);

    const addOption = useCallback(() => {
        setOptions(prev => [...prev, { value: `opcao_${prev.length + 1}`, label: 'Nova Opção' }]);
    }, []);

    const updateOption = useCallback((index: number, newLabel: string) => {
        setOptions(prev => prev.map((opt, i) =>
            i === index ? { ...opt, label: newLabel, value: createSlug(newLabel) } : opt));
    }, []);

    const removeOption = useCallback((index: number) => {
        setOptions(prev => prev.filter((_, i) => i !== index));
    }, []);

    const buildPayload = useCallback((): CreateFieldTemplatePayload | null => {
        const trimmedName = name.trim();
        if (!trimmedName) return null;
        if (hasOptions && options.length === 0) return null;

        return {
            name: trimmedName,
            schema: {
                baseType,
                label: label.trim() || trimmedName,
                required,
                options: hasOptions ? options : undefined,
            },
        };
    }, [name, baseType, label, required, options, hasOptions]);

    return {
        editingId,
        name, setName,
        baseType, setBaseType,
        label, setLabel,
        required, setRequired,
        options, hasOptions,
        addOption, updateOption, removeOption,
        reset, loadTemplate, buildPayload,
    };
};
