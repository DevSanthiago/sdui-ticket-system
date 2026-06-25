import { useState, useEffect } from 'react';
import type { FormattedBoardTicket } from '../../types';
import { LOADING_MESSAGES, LOADING_MESSAGE_INTERVAL_MS } from '../../constants/tickets/ticketSuccessConstants';

interface UseTicketSuccessModalParams {
    isGenerating: boolean;
    ticketData: FormattedBoardTicket | null;
    actionType: 'create' | 'start' | 'resolve';
}

export const useTicketSuccessModal = ({
    isGenerating, ticketData, actionType
}: UseTicketSuccessModalParams) => {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        if (!isGenerating) return;

        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, LOADING_MESSAGE_INTERVAL_MS);

        return () => {
            clearInterval(interval);
            setMsgIndex(0);
        };
    }, [isGenerating]);

    const getModalHeading = () => {
        const id = ticketData?.id ?? '...';
        switch (actionType) {
            case 'start': return `Você assumiu o E-Ticket #${id}`;
            case 'resolve': return `Parabéns! Você finalizou o E-Ticket #${id}`;
            case 'create': return `E-Ticket #${id} gerado com sucesso!`;
            default: return "Processo realizado!";
        }
    };

    return { msgIndex, getModalHeading };
};