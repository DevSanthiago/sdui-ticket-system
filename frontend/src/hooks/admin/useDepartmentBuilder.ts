import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import type { FormFieldSchema, DepartmentBuilderData, DepartmentBuilderStep } from '../../types';

export const useDepartmentBuilder = (isDarkMode: boolean) => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<DepartmentBuilderStep>(1);
    const [isSaving, setIsSaving] = useState(false);
    const [formFields, setFormFields] = useState<FormFieldSchema[]>([]);

    const [departmentData, setDepartmentData] = useState<DepartmentBuilderData>({
        name: '',
        description: '',
        iconName: 'AnimatedBox',
        badgeInput: '',
        cardColorHex: isDarkMode ? '#4299E1' : '#3182CE',
        summaryFields: [],
        allowedRoles: []
    });

    const handleDepartmentDataChange = (field: string, value: string | string[]) => {
        setDepartmentData(prev => ({ ...prev, [field]: value }));
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!departmentData.name.trim()) {
                return Alert.warning("Atenção", "Dê um nome para o departamento antes de continuar.", isDarkMode);
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (formFields.length === 0) {
                return Alert.warning("Atenção", "Adicione pelo menos um campo ao formulário.", isDarkMode);
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
        else navigate('/cockpit-admin');
    };

    const handleSave = async () => {
        if (formFields.length === 0) {
            return Alert.warning("Atenção", "Adicione pelo menos um campo ao formulário.", isDarkMode);
        }

        setIsSaving(true);
        try {
            const finalBadges = departmentData.badgeInput
                .split(',')
                .map(b => b.trim())
                .filter(b => b.length > 0)
                .slice(0, 3);

            const payload = {
                name: departmentData.name,
                description: departmentData.description,
                iconName: departmentData.iconName,
                badges: finalBadges,
                cardColorHex: departmentData.cardColorHex,
                allowedRoles: departmentData.allowedRoles,
                formSchema: {
                    title: `Abertura de Ticket: ${departmentData.name}`,
                    theme: "default",
                    fields: formFields,
                    summaryFields: departmentData.summaryFields
                }
            };

            await api.post(API_ENDPOINTS.DEPARTMENTS.CREATE, payload);
            await Alert.success("Sucesso", "Departamento criado com sucesso!", isDarkMode);
            navigate('/cockpit-admin');
        } catch (error) {
            console.error(error);
            Alert.error("Erro", "Falha ao salvar o departamento.", isDarkMode);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        currentStep, setCurrentStep,
        isSaving,
        departmentData,
        formFields, setFormFields,
        handleDepartmentDataChange,
        handleNextStep,
        handleBackStep,
        handleSave,
    };
};