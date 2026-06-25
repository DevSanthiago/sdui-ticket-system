import { useCallback, useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import type { FormFieldSchema, FormFieldOption, DynamicAnswersRecord, DynamicFieldValue, ActiveIconSelection, FieldTemplate, CreateFieldTemplatePayload } from '../../types';
import { createSlug } from '../../helpers/stringHelpers';
import { useFieldTemplates } from './useFieldTemplates';
import { TEMPLATE_VALUE_PREFIX, CREATE_TYPE_ACTION } from '../../constants/admin/fieldBuilderConstants';

const ensureUniqueId = (baseSlug: string, allFields: FormFieldSchema[], selfIndex: number): string => {
    const taken = new Set(allFields.filter((_, i) => i !== selfIndex).map(f => f.id));
    if (!baseSlug || !taken.has(baseSlug)) return baseSlug;
    let n = 2;
    while (taken.has(`${baseSlug}_${n}`)) n++;
    return `${baseSlug}_${n}`;
};

interface UseFormBuilderParams {
    fields: FormFieldSchema[];
    onChange: (fields: FormFieldSchema[]) => void;
    isDarkMode: boolean;
}

export const useFormBuilder = ({ fields, onChange, isDarkMode }: UseFormBuilderParams) => {
    const [activeIconSelection, setActiveIconSelection] = useState<ActiveIconSelection | null>(null);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [previewAnswers, setPreviewAnswers] = useState<DynamicAnswersRecord>({});

    const { templates, isSaving: isSavingTemplate, createTemplate, updateTemplate, deleteTemplate } = useFieldTemplates(isDarkMode);
    const { isOpen: isTypeModalOpen, onOpen: openTypeModal, onClose: closeTypeModal } = useDisclosure();
    const [typeModalFieldIndex, setTypeModalFieldIndex] = useState<number | null>(null);

    // Refs com o estado mais recente: permitem handlers de identidade estável (useCallback [])
    // sem fechar sobre valores velhos — essencial para o React.memo dos campos funcionar.
    const fieldsRef = useRef(fields);
    const templatesRef = useRef(templates);
    const activeIconRef = useRef(activeIconSelection);
    const typeModalIndexRef = useRef(typeModalFieldIndex);
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        fieldsRef.current = fields;
        templatesRef.current = templates;
        activeIconRef.current = activeIconSelection;
        typeModalIndexRef.current = typeModalFieldIndex;
        onChangeRef.current = onChange;
    });

    const commit = useCallback((next: FormFieldSchema[]) => onChangeRef.current(next), []);

    const handlePreviewAnswerChange = useCallback((fieldId: string, value: DynamicFieldValue) => {
        setPreviewAnswers(prev => ({ ...prev, [fieldId]: value }));
    }, []);

    const handleAddField = useCallback(() => {
        const stamp = Date.now();
        const newField: FormFieldSchema = {
            id: `campo_${stamp}`,
            uid: `uid_${stamp}`,
            type: 'text',
            label: 'Nova Pergunta',
            required: true,
        };
        commit([...fieldsRef.current, newField]);
    }, [commit]);

    const handleUpdateField = useCallback(<K extends keyof FormFieldSchema>(index: number, key: K, value: FormFieldSchema[K]) => {
        const updatedFields = [...fieldsRef.current];
        const previousId = updatedFields[index].id;

        if (key === 'type' && (value === 'select' || value === 'card_radio')) {
            const defaultOptions: FormFieldOption[] = value === 'card_radio'
                ? [{ label: 'Nova Opção', value: `opcao_${Date.now()}` }]
                : [];
            updatedFields[index] = { ...updatedFields[index], [key]: value, options: defaultOptions } as FormFieldSchema;
        } else if (key === 'type' && value === 'dynamic_location') {
            updatedFields[index] = {
                ...updatedFields[index], [key]: value,
                options: [], id: 'informacoes_linha', label: 'Informações da Linha'
            } as FormFieldSchema;
        } else if (key === 'type' && value === 'line_stop') {
            updatedFields[index] = {
                ...updatedFields[index], [key]: value,
                options: [], id: 'status_parada_linha', label: 'A linha está parada?'
            } as FormFieldSchema;
        } else if (key === 'type' && value === 'setup_material') {
            updatedFields[index] = {
                ...updatedFields[index], [key]: value,
                options: [], id: 'material_setup',
                label: 'Informe o material da solicitação', required: true
            } as FormFieldSchema;
        } else {
            updatedFields[index] = { ...updatedFields[index], [key]: value } as FormFieldSchema;
            if (key === 'label' && !['dynamic_location', 'line_stop', 'setup_product'].includes(updatedFields[index].type)) {
                updatedFields[index].id = ensureUniqueId(createSlug(value as string), updatedFields, index);
            }
        }

        if (key === 'type') {
            updatedFields[index] = { ...updatedFields[index], templateId: undefined };
        }

        const nextId = updatedFields[index].id;
        if (previousId !== nextId) {
            for (let i = 0; i < updatedFields.length; i++) {
                if (updatedFields[i].dependsOn?.field === previousId) {
                    updatedFields[i] = {
                        ...updatedFields[i],
                        dependsOn: { ...updatedFields[i].dependsOn!, field: nextId }
                    };
                }
            }
        }

        commit(updatedFields);
    }, [commit]);

    const handleRemoveField = useCallback((index: number) => {
        commit(fieldsRef.current.filter((_, i) => i !== index));
    }, [commit]);

    const handleAddOption = useCallback((fieldIndex: number) => {
        const updatedFields = [...fieldsRef.current];
        const currentOptions = updatedFields[fieldIndex].options || [];
        updatedFields[fieldIndex] = {
            ...updatedFields[fieldIndex],
            options: [...currentOptions, { value: `opcao_${Date.now()}`, label: 'Nova Opção' }],
        };
        commit(updatedFields);
    }, [commit]);

    const handleUpdateOption = useCallback((fieldIndex: number, optionIndex: number, newLabel: string) => {
        const updatedFields = [...fieldsRef.current];
        const field = updatedFields[fieldIndex];
        if (field.options) {
            updatedFields[fieldIndex] = {
                ...field,
                options: field.options.map((opt, i) =>
                    i === optionIndex ? { ...opt, label: newLabel, value: createSlug(newLabel) } : opt),
            };
        }
        commit(updatedFields);
    }, [commit]);

    const handleRemoveOption = useCallback((fieldIndex: number, optionIndex: number) => {
        const updatedFields = [...fieldsRef.current];
        const field = updatedFields[fieldIndex];
        if (field.options) {
            updatedFields[fieldIndex] = {
                ...field,
                options: field.options.filter((_, i) => i !== optionIndex),
            };
        }
        commit(updatedFields);
    }, [commit]);

    const handleSelectOptionIcon = useCallback((fieldIndex: number, optionIndex: number, iconName: string) => {
        const updatedFields = [...fieldsRef.current];
        const field = updatedFields[fieldIndex];
        if (field.options) {
            updatedFields[fieldIndex] = {
                ...field,
                options: field.options.map((opt, i) => i === optionIndex ? { ...opt, iconName } : opt),
            };
        }
        commit(updatedFields);
    }, [commit]);

    const handleUpdateOptionIcon = useCallback((iconName: string) => {
        const sel = activeIconRef.current;
        if (!sel) return;
        handleSelectOptionIcon(sel.fieldIndex, sel.optionIndex, iconName);
        setActiveIconSelection(null);
    }, [handleSelectOptionIcon]);

    const handleOpenIconModal = useCallback((fieldIndex: number, optionIndex: number) => {
        setActiveIconSelection({ fieldIndex, optionIndex });
    }, []);

    const applyTemplate = useCallback((index: number, template: FieldTemplate) => {
        const updatedFields = [...fieldsRef.current];
        const { baseType, label, required, options } = template.schema;
        updatedFields[index] = {
            ...updatedFields[index],
            type: baseType,
            label,
            required,
            options: options ? options.map(opt => ({ ...opt })) : undefined,
            templateId: template.id,
        };
        commit(updatedFields);
    }, [commit]);

    const handleFieldTypeChange = useCallback((index: number, value: string) => {
        if (value === CREATE_TYPE_ACTION) {
            setTypeModalFieldIndex(index);
            openTypeModal();
            return;
        }
        if (value.startsWith(TEMPLATE_VALUE_PREFIX)) {
            const templateId = Number(value.slice(TEMPLATE_VALUE_PREFIX.length));
            const template = templatesRef.current.find(t => t.id === templateId);
            if (template) applyTemplate(index, template);
            return;
        }
        handleUpdateField(index, 'type', value as FormFieldSchema['type']);
    }, [openTypeModal, applyTemplate, handleUpdateField]);

    const handleCloseTypeModal = useCallback(() => {
        setTypeModalFieldIndex(null);
        closeTypeModal();
    }, [closeTypeModal]);

    const handleCreateTemplate = useCallback(async (payload: CreateFieldTemplatePayload): Promise<FieldTemplate | null> => {
        const created = await createTemplate(payload);
        if (created && typeModalIndexRef.current !== null) {
            applyTemplate(typeModalIndexRef.current, created);
        }
        return created;
    }, [createTemplate, applyTemplate]);

    const handleUpdateTemplate = useCallback((id: number, payload: CreateFieldTemplatePayload): Promise<FieldTemplate | null> => {
        return updateTemplate(id, payload);
    }, [updateTemplate]);

    return {
        activeIconSelection,
        isAddHovered, setIsAddHovered,
        previewAnswers,
        handlePreviewAnswerChange,
        handleAddField,
        handleUpdateField,
        handleRemoveField,
        handleAddOption,
        handleUpdateOption,
        handleRemoveOption,
        handleSelectOptionIcon,
        handleUpdateOptionIcon,
        handleOpenIconModal,
        fieldTemplates: templates,
        isSavingTemplate,
        handleFieldTypeChange,
        handleCreateTemplate,
        handleUpdateTemplate,
        deleteTemplate,
        isTypeModalOpen,
        handleCloseTypeModal,
    };
};
