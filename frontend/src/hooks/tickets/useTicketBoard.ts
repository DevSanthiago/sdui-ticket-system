import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { Alert } from '../../services/alerts/alertService';
import { notifyChecklistChanged } from '../checklist/usePendingChecklist';
import { TICKET_CREATED_EVENT } from '../notifications/useTicketNotifications';
import { TicketStatus } from '../../types/models.types';
import type { FormattedBoardTicket, TicketModalData, DynamicField, Department, Ticket, DynamicAnswersRecord } from '../../types';
import type { AxiosError } from 'axios';

export const useTicketBoard = () => {
    const { isOpen: isDetailsOpen, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure();
    const { isOpen: isReceiptOpen, onOpen: onOpenReceipt, onClose: onCloseReceipt } = useDisclosure();

    const location = useLocation();
    const initialDeptFromNav = (location.state as { departmentId?: number | null } | null)?.departmentId ?? null;

    const [activeDepartments, setActiveDepartments] = useState<Department[]>([]);
    const [tickets, setTickets] = useState<FormattedBoardTicket[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [selectedDept, setSelectedDept] = useState<number | null>(initialDeptFromNav);
    
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<FormattedBoardTicket | null>(null);
    const [receiptTicketData, setReceiptTicketData] = useState<FormattedBoardTicket | null>(null);
    
    const [animatingBite, setAnimatingBite] = useState(false);
    const [animatingTear, setAnimatingTear] = useState(false);

    const fetchBoardData = useCallback(async (showMainSpinner = true) => {
        if (showMainSpinner) setIsLoadingTickets(true);
        try {
            const [deptResponse, ticketResponse] = await Promise.all([
                api.get(API_ENDPOINTS.ACTIONS_PANEL.GET_ALL),
                api.get(API_ENDPOINTS.TICKETS.GET_ALL)
            ]);

            const ativos: Department[] = (deptResponse.data || []).filter((d: Department) => d.isActive);
            setActiveDepartments(ativos);

            if (ativos.length > 0 && showMainSpinner) {
                const defaultDept = ativos[0];
                setSelectedDept(prev => prev === null ? defaultDept.id : prev);
            }

            const rawTickets: Ticket[] = ticketResponse.data || [];

            const formattedTickets: FormattedBoardTicket[] = rawTickets.map(ticket => {
                const deptMatch = ativos.find(d => d.id === ticket.departmentId);
                const deptColor = deptMatch?.cardColorHex || '#3182CE';
                const mappedDynamicFields: DynamicField[] = [];

                let answers: DynamicAnswersRecord = {};
                if (ticket.dynamicAnswers) {
                    try {
                        answers = typeof ticket.dynamicAnswers === 'string'
                            ? JSON.parse(ticket.dynamicAnswers as unknown as string)
                            : ticket.dynamicAnswers;
                    } catch {
                        console.error(`Erro ao parsear respostas do ticket #${ticket.id}`);
                    }
                }

                if (deptMatch && deptMatch.formSchema && Object.keys(answers).length > 0) {
                    deptMatch.formSchema.fields.forEach(field => {
                        let value = answers[field.id];
                        if (value !== undefined && value !== null && value !== "") {
                            if (field.type === 'dynamic_location' || field.type === 'line') {
                                value = ticket.lineName || String(value);
                            }
                            if (field.options && Array.isArray(field.options)) {
                                const selectedOption = field.options.find(opt => String(opt.value) === String(value));
                                if (selectedOption) value = selectedOption.label;
                            }
                            if (typeof value === 'boolean') {
                                value = value ? "Sim" : "Não";
                            }
                            mappedDynamicFields.push({
                                id: field.id, 
                                label: field.label, 
                                value: String(value), 
                                rawValue: value
                            });
                        }
                    });
                }

                return {
                    id: ticket.id.toString(),
                    departmentId: ticket.departmentId,
                    departmentName: ticket.departmentName || deptMatch?.name || 'Desconhecido',
                    departmentColor: deptColor,
                    lineName: ticket.lineName,
                    openedBy: ticket.monitorName || 'Usuário Desconhecido',
                    openedAt: new Date(ticket.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
                    isLineStopped: ticket.isLineStopped,
                    status: ticket.status as TicketStatus,
                    dynamicFields: mappedDynamicFields,
                    startedBy: ticket.technicianName,
                    startedAt: ticket.startedAt ? new Date(ticket.startedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
                    finishedBy: ticket.technicianName,
                    finishedAt: ticket.finishedAt ? new Date(ticket.finishedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : undefined,
                } as FormattedBoardTicket; 
            });

            setTickets(formattedTickets);
        } catch (error) {
            console.error("Falha ao buscar dados do board:", error);
        } finally {
            if (showMainSpinner) {
                setTimeout(() => { setIsLoadingTickets(false); }, 1500);
            }
        }
    }, []);

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    useEffect(() => {
        const handler = () => { fetchBoardData(false); };
        window.addEventListener(TICKET_CREATED_EVENT, handler);
        return () => window.removeEventListener(TICKET_CREATED_EVENT, handler);
    }, [fetchBoardData]);

    const handleTicketAction = async (ticket: FormattedBoardTicket | TicketModalData, e?: React.MouseEvent, isDarkMode?: boolean) => {
        if (e) e.stopPropagation();
        if (!ticket) return;

        setActionLoadingId(String(ticket.id));
        try {
            const storedUserStr = localStorage.getItem(STORAGE_KEYS.USER);
            let technicianName = "Técnico não identificado";
            if (storedUserStr) {
                try {
                    const parsedUser = JSON.parse(storedUserStr);
                    technicianName = parsedUser?.name || parsedUser?.Name || technicianName;
                } catch {
                    // leitura do localStorage falhou — mantém nome padrão
                }
            }

            const nowStr = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

            if (ticket.status === TicketStatus.Open) {
                await api.put(API_ENDPOINTS.TICKETS.START(Number(ticket.id)));
                Alert.toast("Ticket assumido com sucesso!", "success", isDarkMode);

                const updatedTicket = { ...ticket, status: TicketStatus.InProgress, startedAt: nowStr, startedBy: technicianName } as FormattedBoardTicket;

                if (selectedTicket?.id === ticket.id) {
                    setAnimatingBite(true);
                    setSelectedTicket(updatedTicket);
                    await fetchBoardData(false);
                    setTimeout(() => setAnimatingBite(false), 1000);
                } else {
                    await fetchBoardData(false);
                }

                setReceiptTicketData(updatedTicket);
                onOpenReceipt();

            } else if (ticket.status === TicketStatus.InProgress) {
                await api.put(API_ENDPOINTS.TICKETS.RESOLVE(Number(ticket.id)));
                Alert.toast("Ticket finalizado com sucesso!", "success", isDarkMode);
                notifyChecklistChanged();

                const updatedTicket = { ...ticket, status: TicketStatus.Resolved, finishedAt: nowStr } as FormattedBoardTicket;

                if (selectedTicket?.id === ticket.id) {
                    setAnimatingTear(true);
                    setSelectedTicket(updatedTicket);
                    await fetchBoardData(false);
                    setTimeout(() => {
                        onCloseDetails();
                        setAnimatingTear(false);
                    }, 1500);
                } else {
                    await fetchBoardData(false);
                }

                setReceiptTicketData(updatedTicket);
                onOpenReceipt();
            }
        
        } catch (error) {
            console.error(error);
            const axiosError = error as AxiosError<{ message?: string }>;
            const errorMessage = axiosError.response?.data?.message;
            if (errorMessage && errorMessage.includes("Controle de Downtime (WIP)")) {
                Alert.warning("Controle de Downtime", errorMessage.replace("Controle de Downtime (WIP): ", ""), isDarkMode);
            } else {
                Alert.error("Erro da Operação", errorMessage || "Erro ao processar o ticket", isDarkMode);
            }
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleTicketClick = (ticket: FormattedBoardTicket) => {
        setSelectedTicket(ticket);
        onOpenDetails();
    };

    return {
        activeDepartments, tickets, isLoadingTickets, selectedDept, setSelectedDept,
        actionLoadingId, selectedTicket, handleTicketClick, handleTicketAction,
        isDetailsOpen, onCloseDetails, animatingBite, animatingTear,
        isReceiptOpen, receiptTicketData, onCloseReceipt
    };
};