import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { buildTicketReceiptPayload } from '../../services/tickets/ticketMapperService';
import type { Department, DynamicAnswersRecord, FormattedBoardTicket, ApiErrorResponse } from '../../types';

export const useTicketSubmission = (departmentId: string | undefined, department: Department | null) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdTicketData, setCreatedTicketData] = useState<FormattedBoardTicket | null>(null);
    const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();

    const submitTicket = async (
        answers: DynamicAnswersRecord,
        productionLineId: number | null,
        fallbackLineName: string,
        isLineStopped: boolean,
        lineStoppedTime: string | null
    ) => {
        if (!department || !departmentId) return false;

        setIsSubmitting(true);
        try {
            const payload = {
                departmentId: Number(departmentId),
                productionLineId: productionLineId,
                isLineStopped: isLineStopped,
                lineStoppedTime: lineStoppedTime,
                dynamicAnswers: answers
            };

            const response = await api.post('/tickets', payload);

            const realLineName = response.data.lineName || fallbackLineName;

            const formattedNewTicket = buildTicketReceiptPayload(
                response.data.ticketId,
                payload.departmentId,
                realLineName,
                isLineStopped,
                answers,
                department
            );

            setCreatedTicketData(formattedNewTicket);
            onOpenSuccess();
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse & { code?: string }>;
            if (err.response?.data?.code === 'CHECKLIST_PENDING') {
                await Alert.warning(
                    'Checklist pendente',
                    err.response.data.message || 'Conclua o checklist pendente antes de abrir um novo ticket.'
                );
                navigate('/checklists');
                return false;
            }
            Alert.error('Erro', 'Falha ao abrir o ticket.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitTicket,
        isSubmitting,
        createdTicketData,
        isSuccessOpen,
        onCloseSuccess
    };
};