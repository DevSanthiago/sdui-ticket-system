import { useCallback, useEffect, useRef, useState } from 'react';
import { AxiosError } from 'axios';
import { fieldTemplatesService } from '../../services/api/fieldTemplatesService';
import { Alert } from '../../services/alerts/alertService';
import type { ApiErrorResponse, FieldTemplate, CreateFieldTemplatePayload } from '../../types';

const sortByName = (list: FieldTemplate[]) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name));

export const useFieldTemplates = (isDarkMode: boolean) => {
    const [templates, setTemplates] = useState<FieldTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isDarkModeRef = useRef(isDarkMode);
    useEffect(() => { isDarkModeRef.current = isDarkMode; }, [isDarkMode]);

    const loadTemplates = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fieldTemplatesService.getAll();
            setTemplates(sortByName(response.data));
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Erro ao carregar tipos de campo.", "error", isDarkModeRef.current);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadTemplates(); }, [loadTemplates]);

    const createTemplate = useCallback(async (payload: CreateFieldTemplatePayload): Promise<FieldTemplate | null> => {
        try {
            setIsSaving(true);
            const response = await fieldTemplatesService.create(payload);
            setTemplates(prev => sortByName([...prev, response.data]));
            Alert.toast("Tipo de campo criado com sucesso!", "success", isDarkModeRef.current);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Falha ao criar o tipo de campo.", "error", isDarkModeRef.current);
            return null;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const updateTemplate = useCallback(async (id: number, payload: CreateFieldTemplatePayload): Promise<FieldTemplate | null> => {
        try {
            setIsSaving(true);
            const response = await fieldTemplatesService.update(id, payload);
            setTemplates(prev => sortByName(prev.map(t => t.id === id ? response.data : t)));
            Alert.toast("Tipo de campo atualizado com sucesso!", "success", isDarkModeRef.current);
            return response.data;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Falha ao atualizar o tipo de campo.", "error", isDarkModeRef.current);
            return null;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (template: FieldTemplate) => {
        const result = await Alert.confirm(
            "Excluir tipo de campo",
            `Tem certeza que deseja excluir o tipo "${template.name}"? Os campos já criados a partir dele não serão afetados.`,
            isDarkModeRef.current
        );

        if (!result.isConfirmed) return;

        try {
            await fieldTemplatesService.remove(template.id);
            setTemplates(prev => prev.filter(t => t.id !== template.id));
            Alert.toast("Tipo de campo excluído com sucesso!", "success", isDarkModeRef.current);
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Falha ao excluir o tipo de campo.", "error", isDarkModeRef.current);
        }
    }, []);

    return { templates, isLoading, isSaving, createTemplate, updateTemplate, deleteTemplate };
};
