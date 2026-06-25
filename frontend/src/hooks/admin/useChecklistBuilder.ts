import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type {
    ChecklistTemplate, ChecklistItemSchema, ChecklistFieldSchema, ChecklistTemplateSchema,
    CardData, ChecklistMetaData, ChecklistLinkData, ChecklistBuilderStep, ChecklistBuilderView,
    CreateChecklistTemplateDto, UpdateChecklistTemplateDto, AnimatedIconKey
} from '../../types';

const DEFAULT_FIELDS: ChecklistFieldSchema[] = [
    { id: 'produtoAtual', type: 'text', label: 'Produto Atual (Rodando)', required: true, readOnly: true },
    { id: 'produtoSetup', type: 'text', label: 'Produto em Setup (Entrando)', required: true, readOnly: false },
    { id: 'liderLinha', type: 'text', label: 'Lider da linha', required: true, readOnly: false },
    { id: 'observacao', type: 'textarea', label: 'Observações do Monitor', required: false, readOnly: false },
];

const buildInitialCardData = (isDarkMode: boolean): CardData => ({
    name: '',
    description: '',
    iconName: 'AnimatedFileCheck2',
    badgeInput: '',
    cardColorHex: isDarkMode ? '#4299E1' : '#3182CE',
});

const buildInitialMeta = (): ChecklistMetaData => ({
    title: '',
    documentCode: '',
    emissionDate: '',
    revision: '',
    elaboratedBy: '',
    approvedBy: '',
    actingDepartment: '',
});

const buildInitialLink = (): ChecklistLinkData => ({
    departmentId: null,
    triggerFieldId: null,
    triggerFieldValue: null,
});

export const useChecklistBuilder = (isDarkMode: boolean) => {
    const navigate = useNavigate();

    const [view, setView] = useState<ChecklistBuilderView>('selection');
    const [currentStep, setCurrentStep] = useState<ChecklistBuilderStep>(1);

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [editingId, setEditingId] = useState<number | null>(null);
    const [isActive, setIsActive] = useState(true);

    const [cardData, setCardData] = useState<CardData>(buildInitialCardData(isDarkMode));
    const [meta, setMeta] = useState<ChecklistMetaData>(buildInitialMeta());
    const [items, setItems] = useState<ChecklistItemSchema[]>([]);
    const [fields, setFields] = useState<ChecklistFieldSchema[]>(DEFAULT_FIELDS);
    const [link, setLink] = useState<ChecklistLinkData>(buildInitialLink());

    const fetchTemplates = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<ChecklistTemplate[]>(
                `${API_ENDPOINTS.CHECKLIST_TEMPLATES.BASE}?includeInactive=true`
            );
            setTemplates(response.data || []);
        } catch (error) {
            console.error(error);
            Alert.error('Erro', 'Falha ao carregar os checklists.', isDarkMode);
        } finally {
            setLoading(false);
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (view === 'selection') fetchTemplates();
    }, [view, fetchTemplates]);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery.trim()) return templates;
        const lowerQ = searchQuery.toLowerCase();
        return templates.filter(t =>
            t.name?.toLowerCase().includes(lowerQ) ||
            t.description?.toLowerCase().includes(lowerQ)
        );
    }, [templates, searchQuery]);

    const resetBuilderState = useCallback(() => {
        setEditingId(null);
        setIsActive(true);
        setCurrentStep(1);
        setCardData(buildInitialCardData(isDarkMode));
        setMeta(buildInitialMeta());
        setItems([]);
        setFields(DEFAULT_FIELDS);
        setLink(buildInitialLink());
    }, [isDarkMode]);

    const handleCreateNew = () => {
        resetBuilderState();
        setView('building');
    };

    const handleSelectTemplate = (template: ChecklistTemplate) => {
        const schema = template.schema || ({} as ChecklistTemplateSchema);

        setEditingId(template.id);
        setIsActive(template.isActive);
        setCurrentStep(1);

        setCardData({
            name: template.name || '',
            description: template.description || '',
            iconName: (template.iconName as AnimatedIconKey) || 'AnimatedFileCheck2',
            badgeInput: Array.isArray(schema.badges) ? schema.badges.join(', ') : '',
            cardColorHex: template.cardColorHex || (isDarkMode ? '#4299E1' : '#3182CE'),
        });

        setMeta({
            title: schema.title || '',
            documentCode: schema.documentCode || '',
            emissionDate: schema.emissionDate || '',
            revision: schema.revision || '',
            elaboratedBy: schema.elaboratedBy || '',
            approvedBy: schema.approvedBy || '',
            actingDepartment: schema.actingDepartment || '',
        });

        setItems(Array.isArray(schema.items) ? schema.items : []);
        setFields(Array.isArray(schema.fields) && schema.fields.length > 0 ? schema.fields : DEFAULT_FIELDS);

        setLink({
            departmentId: template.departmentId ?? null,
            triggerFieldId: template.triggerFieldId ?? null,
            triggerFieldValue: template.triggerFieldValue ?? null,
        });

        setView('editing');
    };

    const handleLinkChange = <K extends keyof ChecklistLinkData>(field: K, value: ChecklistLinkData[K]) => {
        setLink(prev => ({ ...prev, [field]: value }));
    };

    const handleCardChange = <K extends keyof CardData>(field: K, value: CardData[K]) => {
        setCardData(prev => ({ ...prev, [field]: value }));
    };

    const handleMetaChange = <K extends keyof ChecklistMetaData>(field: K, value: ChecklistMetaData[K]) => {
        setMeta(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!cardData.name.trim()) {
                return Alert.warning('Atenção', 'Dê um nome para o checklist antes de continuar.', isDarkMode);
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (items.length === 0) {
                return Alert.warning('Atenção', 'Adicione pelo menos um item de verificação ao checklist.', isDarkMode);
            }
            setCurrentStep(3);
        } else if (currentStep === 3) {
            setCurrentStep(4);
        }
    };

    const handleBackStep = () => {
        if (currentStep === 4) setCurrentStep(3);
        else if (currentStep === 3) setCurrentStep(2);
        else if (currentStep === 2) setCurrentStep(1);
        else handleBackToSelection();
    };

    const handleBackToSelection = () => {
        resetBuilderState();
        setView('selection');
    };

    const buildSchema = (): ChecklistTemplateSchema => ({
        title: meta.title.trim() || `Checklist: ${cardData.name.trim()}`,
        documentCode: meta.documentCode.trim() || undefined,
        emissionDate: meta.emissionDate.trim() || undefined,
        revision: meta.revision.trim() || undefined,
        elaboratedBy: meta.elaboratedBy.trim() || undefined,
        approvedBy: meta.approvedBy.trim() || undefined,
        actingDepartment: meta.actingDepartment.trim() || undefined,
        badges: (cardData.badgeInput || '')
            .split(',')
            .map(b => b.trim())
            .filter(b => b.length > 0)
            .slice(0, 3),
        fields,
        items,
    });

    const handleSave = async () => {
        if (items.length === 0) {
            return Alert.warning('Atenção', 'Adicione pelo menos um item de verificação ao checklist.', isDarkMode);
        }

        setIsSaving(true);
        try {
            const schema = buildSchema();

            const triggerFields = {
                departmentId: link.departmentId,
                triggerFieldId: link.triggerFieldId,
                triggerFieldValue: link.triggerFieldValue,
            };

            if (view === 'editing' && editingId != null) {
                const payload: UpdateChecklistTemplateDto = {
                    name: cardData.name.trim(),
                    description: cardData.description?.trim(),
                    cardColorHex: cardData.cardColorHex,
                    iconName: cardData.iconName,
                    isActive,
                    schema,
                    allowedRoles: [],
                    ...triggerFields,
                };
                await api.put(API_ENDPOINTS.CHECKLIST_TEMPLATES.UPDATE(editingId), payload);
                Alert.toast('As alterações do checklist foram salvas!', 'success', isDarkMode);
            } else {
                const payload: CreateChecklistTemplateDto = {
                    name: cardData.name.trim(),
                    description: cardData.description?.trim(),
                    cardColorHex: cardData.cardColorHex,
                    iconName: cardData.iconName,
                    schema,
                    allowedRoles: [],
                    ...triggerFields,
                };
                await api.post(API_ENDPOINTS.CHECKLIST_TEMPLATES.CREATE, payload);
                await Alert.success('Sucesso', 'Checklist criado com sucesso!', isDarkMode);
            }

            handleBackToSelection();
        } catch (error) {
            console.error(error);
            Alert.error('Erro', 'Falha ao salvar o checklist.', isDarkMode);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        view,
        currentStep, setCurrentStep,
        loading, isSaving,
        templates, filteredTemplates,
        searchQuery, setSearchQuery,
        editingId, isActive, setIsActive,
        cardData, meta, items, fields, link,
        setItems, setFields,
        handleCardChange,
        handleMetaChange,
        handleLinkChange,
        handleCreateNew,
        handleSelectTemplate,
        handleNextStep,
        handleBackStep,
        handleBackToSelection,
        handleSave,
        navigate,
    };
};
