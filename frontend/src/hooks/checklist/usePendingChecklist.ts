import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';

interface PendingStatusResponse {
    hasPending: boolean;
    pendingTicketId: number | null;
}

const CHECKLIST_CHANGED_EVENT = 'ticketsystem:checklist-changed';

export const notifyChecklistChanged = () => {
    window.dispatchEvent(new Event(CHECKLIST_CHANGED_EVENT));
};

export const usePendingChecklist = () => {
    const [hasPending, setHasPending] = useState(false);
    const [pendingTicketId, setPendingTicketId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get<PendingStatusResponse>(API_ENDPOINTS.CHECKLISTS.PENDING_STATUS);
            setHasPending(!!data.hasPending);
            setPendingTicketId(data.pendingTicketId ?? null);
        } catch {
            setHasPending(false);
            setPendingTicketId(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    useEffect(() => {
        const handler = () => { refresh(); };
        window.addEventListener(CHECKLIST_CHANGED_EVENT, handler);
        return () => window.removeEventListener(CHECKLIST_CHANGED_EVENT, handler);
    }, [refresh]);

    return { hasPending, pendingTicketId, loading, refresh };
};
