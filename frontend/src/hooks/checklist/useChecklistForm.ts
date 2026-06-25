import { useState, useEffect, useMemo } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Alert } from '../../services/alerts/alertService';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { api, baseURL } from '../../services/api/api';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { ChecklistStatus } from '../../types';
import { notifyChecklistChanged } from './usePendingChecklist';
import type { ChecklistFormProps, ChecklistContent, ChecklistTemplate, ChecklistItemSchema, ChecklistFieldSchema } from '../../types';

type UseChecklistFormParams = Pick<ChecklistFormProps, 'isOpen' | 'ticket' | 'currentUser' | 'onSuccess' | 'onClose'> & {
    isDarkMode: boolean;
};

const emptyContent = (): ChecklistContent => ({ fields: {}, checks: {} });

export const useChecklistForm = ({
    isOpen, ticket, currentUser, onSuccess, onClose, isDarkMode
}: UseChecklistFormParams) => {
    const { isOpen: isConfirmOpen, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();

    const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
    const [loadingTemplate, setLoadingTemplate] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [hoverPdf, setHoverPdf] = useState(false);
    const [hoverSubmit, setHoverSubmit] = useState(false);

    const [content, setContent] = useState<ChecklistContent>(emptyContent());

    const items: ChecklistItemSchema[] = useMemo(() => template?.schema?.items ?? [], [template]);
    const fields: ChecklistFieldSchema[] = useMemo(() => template?.schema?.fields ?? [], [template]);

    const isChecklistCompleted = !!ticket?.checklistContent || ticket?.checklistStatus === ChecklistStatus.Completed;
    const canFill = ticket?.checklistStatus === ChecklistStatus.Pending;
    const isViewMode = !canFill;
    const canDownloadPdf = isChecklistCompleted;

    const safeChecks = useMemo(
        () => items.map(item => content.checks[item.id] ?? false),
        [items, content.checks]
    );
    const allChecked = safeChecks.length > 0 && safeChecks.every(Boolean);
    const isIndeterminate = safeChecks.some(Boolean) && !allChecked;

    useEffect(() => {
        if (!isOpen || !ticket?.checklistTemplateId) {
            setTemplate(null);
            return;
        }
        let active = true;
        (async () => {
            try {
                setLoadingTemplate(true);
                const { data } = await api.get<ChecklistTemplate>(
                    API_ENDPOINTS.CHECKLIST_TEMPLATES.GET_BY_ID(ticket.checklistTemplateId!)
                );
                if (active) setTemplate(data);
            } catch (error) {
                console.error('Falha ao carregar o template do checklist', error);
                if (active) setTemplate(null);
            } finally {
                if (active) setLoadingTemplate(false);
            }
        })();
        return () => { active = false; };
    }, [isOpen, ticket?.checklistTemplateId]);

    useEffect(() => {
        if (!isOpen || !ticket) return;

        if (ticket.checklistContent) {
            try {
                const parsed = JSON.parse(ticket.checklistContent) as ChecklistContent;
                setContent({
                    fields: parsed.fields ?? {},
                    checks: parsed.checks ?? {},
                    signedBy: parsed.signedBy,
                    signedAt: parsed.signedAt,
                });
                return;
            } catch {
                setContent(emptyContent());
                return;
            }
        }
        setContent(emptyContent());
    }, [isOpen, ticket]);

    useEffect(() => {
        if (!template || !ticket || ticket.checklistContent) return;
        setContent(prev => {
            const prefilled = { ...prev.fields };
            for (const field of template.schema?.fields ?? []) {
                if (prefilled[field.id] == null) {
                    const sourceId = field.sourceFieldId ?? field.id;
                    const answer = ticket.dynamicAnswers?.[sourceId];
                    if (answer != null) prefilled[field.id] = String(answer);
                    else if (field.defaultValue != null) prefilled[field.id] = field.defaultValue;
                }
            }
            return { ...prev, fields: prefilled };
        });
    }, [template, ticket]);

    const setFieldValue = (fieldId: string, value: string) => {
        setContent(prev => ({ ...prev, fields: { ...prev.fields, [fieldId]: value } }));
    };

    const handleCheckChange = (index: number, checked: boolean) => {
        const item = items[index];
        if (!item) return;
        setContent(prev => ({ ...prev, checks: { ...prev.checks, [item.id]: checked } }));
    };

    const handleMasterCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            onOpenConfirm();
        } else {
            setContent(prev => ({ ...prev, checks: {} }));
        }
    };

    const handleConfirmSelectAll = () => {
        setContent(prev => {
            const all: Record<string, boolean> = {};
            for (const item of items) all[item.id] = true;
            return { ...prev, checks: all };
        });
        onCloseConfirm();
        Alert.success('Checklist preenchido!', '', isDarkMode);
    };

    const handleDownloadPdf = async () => {
        if (!ticket || !canDownloadPdf) return;
        setIsDownloading(true);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const activePlantId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANT);

        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;
        if (activePlantId) headers['X-Plant-Id'] = activePlantId;

        try {
            const response = await fetch(`${baseURL}${API_ENDPOINTS.CHECKLISTS.DOWNLOAD_PDF(ticket.id)}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) throw new Error(await response.text() || 'Erro ao baixar PDF');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `checklist_${ticket.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Alert.success('Sucesso', 'PDF baixado com sucesso!', isDarkMode);
        } catch (error) {
            Alert.error('Erro ao baixar PDF', error instanceof Error ? error.message : 'Erro desconhecido', isDarkMode);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSubmit = async () => {
        if (isViewMode || !ticket) return;

        const missing = fields.filter(f => f.required && !content.fields[f.id]?.trim());
        if (missing.length > 0) {
            Alert.error('Campos obrigatórios', `Preencha: ${missing.map(f => f.label).join(', ')}.`, isDarkMode);
            return;
        }

        setIsSubmitting(true);

        const payload: ChecklistContent = {
            ...content,
            signedBy: currentUser?.name,
            signedAt: new Date().toLocaleString('pt-BR'),
        };

        try {
            await api.post(API_ENDPOINTS.CHECKLISTS.SUBMIT, {
                ticketId: ticket.id,
                checklistContent: JSON.stringify(payload),
            });

            Alert.success('Sucesso', 'Checklist enviado com sucesso!', isDarkMode);
            notifyChecklistChanged();
            onSuccess();
            onClose();
        } catch {
            Alert.error('Erro ao enviar', 'Não foi possível processar o checklist.', isDarkMode);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        template, loadingTemplate,
        items, fields,
        content, setFieldValue,
        canFill, isViewMode, canDownloadPdf, isChecklistCompleted,
        safeChecks, allChecked, isIndeterminate,
        isSubmitting, isDownloading,
        hoverPdf, setHoverPdf,
        hoverSubmit, setHoverSubmit,
        isConfirmOpen, onCloseConfirm,
        handleCheckChange,
        handleMasterCheckboxChange,
        handleConfirmSelectAll,
        handleDownloadPdf,
        handleSubmit,
    };
};
