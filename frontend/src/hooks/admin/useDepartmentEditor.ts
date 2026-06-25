import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type {
    Department, FormFieldSchema, DepartmentFormSchema,
    UpdateDepartmentDto, DepartmentEditData, DepartmentEditorView, AnimatedIconKey
} from '../../types';

export const useDepartmentEditor = (isDarkMode: boolean) => {
    const navigate = useNavigate();

    const [view, setView] = useState<DepartmentEditorView>('selection');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editFields, setEditFields] = useState<FormFieldSchema[]>([]);

    const [editData, setEditData] = useState<DepartmentEditData>({
        id: 0,
        name: '',
        description: '',
        iconName: 'AnimatedBox',
        badgeInput: '',
        cardColorHex: isDarkMode ? '#4299E1' : '#3182CE',
        isActive: true,
        summaryFields: [],
        allowedRoles: []
    });

    useEffect(() => {
        const handlePopState = () => {
            if (window.location.hash !== '#edit') {
                setView('selection');
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            if (view !== 'selection') return;
            try {
                setLoading(true);
                const response = await api.get(`${API_ENDPOINTS.ACTIONS_PANEL.GET_ALL}?includeInactive=true`);
                setDepartments(response.data || []);
            } catch (error) {
                console.error(error);
                Alert.error("Erro", "Falha ao carregar os departamentos.", isDarkMode);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, [view, isDarkMode]);

    const filteredDepartments = useMemo(() => {
        if (!searchQuery.trim()) return departments;
        const lowerQ = searchQuery.toLowerCase();
        return departments.filter(d =>
            d.name?.toLowerCase().includes(lowerQ) ||
            d.description?.toLowerCase().includes(lowerQ)
        );
    }, [departments, searchQuery]);

    const handleSelectDepartment = (dept: Department) => {
        let safeRoles: string[] = [];
        if (Array.isArray(dept.allowedRoles)) {
            safeRoles = dept.allowedRoles;
        } else if (typeof dept.allowedRoles === 'string') {
            try { safeRoles = JSON.parse(dept.allowedRoles); }
            catch { console.error("Falha ao ler roles do banco"); }
        }

        const schema = dept.formSchema || ({} as DepartmentFormSchema);
        const safeSummaryFields = Array.isArray(schema.summaryFields) ? schema.summaryFields : [];

        setEditData({
            id: dept.id,
            name: dept.name || '',
            description: dept.description || '',
            iconName: (dept.iconName as AnimatedIconKey) || 'AnimatedBox',
            badgeInput: Array.isArray(dept.badges) ? dept.badges.join(', ') : (dept.badges || ''),
            cardColorHex: dept.cardColorHex || (isDarkMode ? '#4299E1' : '#3182CE'),
            isActive: dept.isActive,
            summaryFields: safeSummaryFields,
            allowedRoles: safeRoles
        });

        setEditFields(schema.fields || []);
        setView('editing');
        window.history.pushState(null, '', '#edit');
    };

    const handleEditDataChange = <K extends keyof DepartmentEditData>(field: K, value: DepartmentEditData[K]) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const payload: UpdateDepartmentDto = {
                name: editData.name,
                description: editData.description,
                cardColorHex: editData.cardColorHex,
                iconName: editData.iconName,
                badges: editData.badgeInput.split(',').map(b => b.trim()).filter(b => b),
                isActive: editData.isActive,
                allowedRoles: editData.allowedRoles,
                formSchema: {
                    title: `Abertura de Ticket: ${editData.name}`,
                    theme: 'blue',
                    fields: editFields,
                    summaryFields: editData.summaryFields
                }
            };

            await api.put(API_ENDPOINTS.DEPARTMENTS.UPDATE(editData.id), payload);
            Alert.toast("As alterações foram salvas!", "success", isDarkMode);

            if (window.location.hash === '#edit') {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            setView('selection');
        } catch (error) {
            console.error(error);
            Alert.toast("Erro ao salvar.", "error", isDarkMode);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = () => {
        setEditData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleBackToSelection = () => {
        if (window.location.hash === '#edit') {
            window.history.back();
        } else {
            setView('selection');
        }
    };

    return {
        view,
        loading, isSaving,
        departments, filteredDepartments,
        searchQuery, setSearchQuery,
        editData, editFields, setEditFields,
        handleSelectDepartment,
        handleEditDataChange,
        handleSaveChanges,
        handleToggleStatus,
        handleBackToSelection,
        navigate,
    };
};