import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box, Flex, Heading, Text, HStack, IconButton, VStack,
    useDisclosure, Badge, Icon, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, Center, Skeleton, Button, SkeletonCircle
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { TicketFilterDrawer } from '../../components/tickets/TicketFilterDrawer';
import { TicketStatus } from '../../types/models.types';
import { TicketDetailsModal } from '../../components/tickets/TicketDetailsModal';
import { TicketFeedbackModal } from '../../components/tickets/TicketFeedbackModal';
import { Alert } from '../../services/alerts/alertService';
import type { Department, Ticket, DynamicAnswersRecord, DynamicFieldValue } from '../../types';
import type { FormattedBoardTicket } from '../../types';

interface TicketHistoryItem extends Omit<Ticket, 'dynamicAnswers'> {
    dynamicAnswers: DynamicAnswersRecord | string;
    resolutionFeedback?: string;
    canAddFeedback?: boolean;
}

const EmptyStateIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const activeColor = isDarkMode ? "#B794F4" : "#805AD5";
    const textGlow = `0 0 15px ${activeColor}88`;

    return (
        <Center h="100%">
            <VStack spacing={6}>
                <Box
                    color={activeColor}
                    filter={`drop-shadow(0 0 15px ${activeColor}88)`}
                >
                    <Icon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        boxSize="96px"
                    >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect height="18" rx="2" width="18" x="3" y="4" />
                        <path d="M3 10h18" />
                        {[
                            { cx: 8, cy: 14 }, { cx: 12, cy: 14 }, { cx: 16, cy: 14 },
                            { cx: 8, cy: 18 }, { cx: 12, cy: 18 }, { cx: 16, cy: 18 }
                        ].map((dot, index) => (
                            <motion.circle
                                key={`${dot.cx}-${dot.cy}`}
                                cx={dot.cx}
                                cy={dot.cy}
                                r="1.5"
                                fill="currentColor"
                                stroke="none"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: index * 0.15,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </Icon>
                </Box>
                <Text color={activeColor} fontSize="xl" fontWeight="bold" textShadow={textGlow} letterSpacing="wide" textAlign="center" px={4} maxW="420px">
                    Utilize os filtros avançados para iniciar sua consulta
                </Text>
            </VStack>
        </Center>
    );
};

interface HistoryTableTicket extends FormattedBoardTicket {
    statusLabel: string;
    statusColor: string;
}

export const TicketHistory = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();

    const { isOpen: isDetailsOpen, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure();
    const { isOpen: isFilterOpen, onOpen: onOpenFilter, onClose: onCloseFilter } = useDisclosure();

    const [activeDepartments, setActiveDepartments] = useState<Department[]>([]);
    const departmentsRef = useRef<Department[]>([]);
    const [tickets, setTickets] = useState<HistoryTableTicket[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const [selectedDept, setSelectedDept] = useState<number | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const cardsPerPage = 12;

    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isHeaderIconHovered, setIsHeaderIconHovered] = useState(false);
    const [hoveredPillId, setHoveredPillId] = useState<number | null>(null);
    const [isFilterBtnHovered, setIsFilterBtnHovered] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<HistoryTableTicket | null>(null);

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackTicketId, setFeedbackTicketId] = useState<number | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1);
        }, 600);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const fetchHistoryData = useCallback(async () => {
        setIsFetching(true);

        try {
            let deptMap = departmentsRef.current;
            if (deptMap.length === 0) {
                const deptResponse = await api.get(API_ENDPOINTS.ACTIONS_PANEL.GET_ALL);
                deptMap = (deptResponse.data || []).filter((d: Department) => d.isActive);
                departmentsRef.current = deptMap;
                setActiveDepartments(deptMap);
            }

            const params = new URLSearchParams();
            params.append('Page', currentPage.toString());
            params.append('PageSize', cardsPerPage.toString());

            if (selectedDept) params.append('DepartmentId', selectedDept.toString());
            if (debouncedSearch) params.append('Search', debouncedSearch);
            if (startDate) params.append('StartDate', startDate);
            if (endDate) params.append('EndDate', endDate);

            if (Object.keys(dynamicFilters).length > 0) {
                params.append('DynamicFilters', JSON.stringify(dynamicFilters));
            }

            const historyResponse = await api.get(`${API_ENDPOINTS.TICKETS_HISTORY.GET_ALL}?${params.toString()}`);

            const paginatedData = historyResponse.data;
            setTotalPages(paginatedData.totalPages || 1);

            const formattedTickets: HistoryTableTicket[] = paginatedData.items.map((ticket: TicketHistoryItem) => {
                const deptMatch = deptMap.find(d => d.id === ticket.departmentId);
                const deptColor = deptMatch?.cardColorHex || '#3182CE';

                let statusLabel = 'Aguardando';
                let statusColor = 'orange.400';
                if (ticket.status === 2) { statusLabel = 'Em curso'; statusColor = 'blue.400'; }
                if (ticket.status === 3) { statusLabel = 'Concluído'; statusColor = 'green.500'; }

                let parsedAnswers: DynamicAnswersRecord = {};
                if (ticket.dynamicAnswers && typeof ticket.dynamicAnswers === 'string') {
                    try { parsedAnswers = JSON.parse(ticket.dynamicAnswers) as DynamicAnswersRecord; } catch {
                        // JSON inválido — mantém parsedAnswers como objeto vazio
                    }
                }

                const dynamicFields = Object.entries(parsedAnswers).map(([k, v]: [string, DynamicFieldValue]) => ({
                    id: k,
                    label: k.replace(/_/g, ' '),
                    value: String(v ?? ''),
                    rawValue: v
                }));

                return {
                    id: String(ticket.id),
                    departmentId: Number(ticket.departmentId),
                    departmentName: ticket.departmentName ? String(ticket.departmentName) : (deptMatch?.name || 'Desconhecido'),
                    departmentColor: deptColor,
                    lineName: String(ticket.lineName || ''),
                    openedBy: String(ticket.monitorName || ''),
                    openedAt: new Date(ticket.createdAt).toLocaleString('pt-BR'),
                    isLineStopped: Boolean(ticket.isLineStopped),
                    status: Number(ticket.status) as TicketStatus,
                    dynamicFields,
                    startedBy: ticket.technicianName,
                    startedAt: ticket.startedAt ? new Date(ticket.startedAt).toLocaleString('pt-BR') : undefined,
                    finishedBy: ticket.technicianName,
                    finishedAt: ticket.finishedAt ? new Date(ticket.finishedAt).toLocaleString('pt-BR') : undefined,
                    resolutionFeedback: ticket.resolutionFeedback,
                    canAddFeedback: Boolean(ticket.canAddFeedback),
                    statusLabel,
                    statusColor
                };
            });

            setTickets(formattedTickets);

        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
            setIsInitialLoading(false);
        }
    }, [currentPage, selectedDept, debouncedSearch, startDate, endDate, dynamicFilters]);

    useEffect(() => {
        fetchHistoryData();
    }, [fetchHistoryData]);

    useEffect(() => {
        if (isInitialLoading) return;
        const startTimer = setTimeout(() => setIsHeaderIconHovered(true), 100);
        const stopTimer = setTimeout(() => setIsHeaderIconHovered(false), 1500);
        return () => { clearTimeout(startTimer); clearTimeout(stopTimer); };
    }, [isInitialLoading]);

    const handleTicketClick = (ticket: HistoryTableTicket) => {
        setSelectedTicket(ticket);
        onOpenDetails();
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setDynamicFilters({});
        setStartDate('');
        setEndDate('');
        setCurrentPage(1);
    };

    const handleDynamicFilterChange = (fieldId: string, value: string) => {
        setDynamicFilters(prev => ({ ...prev, [fieldId]: value }));
        setCurrentPage(1);
    };

    const handleSubmitFeedback = async (id: number, feedback: string) => {
        try {
            await api.patch(API_ENDPOINTS.TICKETS.FEEDBACK(id), { feedback });
            Alert.toast('Feedback registrado no histórico!', 'success', isDarkMode);
            fetchHistoryData();
        } catch (error) {
            console.error(error);
            Alert.error('Erro', 'Não foi possível salvar as observações.', isDarkMode);
        }
    };

    const TableRowSkeleton = () => (
        <Tr borderColor={theme.cardBorder}>
            <Td><Skeleton height="20px" width="120px" /></Td>
            <Td><Skeleton height="20px" width="180px" /></Td>
            <Td><Skeleton height="24px" width="150px" borderRadius="full" /></Td>
            <Td><Skeleton height="20px" width="140px" /></Td>
            <Td><Skeleton height="20px" width="80px" /></Td>
        </Tr>
    );

    return (
        <Flex direction="column" w="100%" h="100%" p={{ base: 4, md: 8 }} bg={theme.bgApp} overflow="hidden">
            <Box mb={6} flexShrink={0}>
                <Flex justify="space-between" align="center" mb={2}>
                    <HStack spacing={4}>
                        <Skeleton isLoaded={!isInitialLoading} borderRadius="md">
                            <IconButton
                                aria-label="Voltar"
                                icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />}
                                onClick={() => navigate('/tickets')}
                                variant="ghost"
                                color={theme.textPrimary}
                                _hover={{ bg: isDarkMode ? "whiteAlpha.200" : "blackAlpha.100" }}
                                onMouseEnter={() => setIsBackHovered(true)}
                                onMouseLeave={() => setIsBackHovered(false)}
                            />
                        </Skeleton>
                        <Box color={theme.iconColor} display="flex" alignItems="center" onMouseEnter={() => !isInitialLoading && setIsHeaderIconHovered(true)} onMouseLeave={() => !isInitialLoading && setIsHeaderIconHovered(false)}>
                            <SkeletonCircle size="32px" isLoaded={!isInitialLoading}>
                                <AnimatedIcons.AnimatedDatabaseBackup size={32} isHovered={isHeaderIconHovered} />
                            </SkeletonCircle>
                        </Box>
                        <Skeleton isLoaded={!isInitialLoading} borderRadius="md" minW="200px">
                            <Heading size="lg" color={theme.textPrimary}>Histórico de Tickets</Heading>
                        </Skeleton>
                    </HStack>
                </Flex>
                <Skeleton isLoaded={!isInitialLoading} borderRadius="md" minW={{ base: "auto", md: "350px" }} maxW="400px" ml={{ base: 0, md: 14 }}>
                    <Text color={theme.textSecondary} fontSize="md">Consulte registros passados e audite tickets da fábrica</Text>
                </Skeleton>
            </Box>

            <Flex justify="space-between" align="center" py={2} mb={4}>
                <Box overflowX="auto" css={{ '&::-webkit-scrollbar': { display: 'none' } }} flex={1} mx={-2} px={2}>
                    <HStack spacing={3} py={3}>
                        <Skeleton isLoaded={!isInitialLoading} borderRadius="full">
                            <Button
                                borderRadius="full" px={5} size="sm" fontWeight="bold" variant="outline"
                                flexShrink={0} whiteSpace="nowrap"
                                bg={selectedDept === null ? (isDarkMode ? `whiteAlpha.200` : `blackAlpha.100`) : theme.cardBg}
                                color={selectedDept === null ? theme.textPrimary : theme.textSecondary}
                                borderColor={selectedDept === null ? theme.textPrimary : theme.cardBorder}
                                onClick={() => { setSelectedDept(null); setCurrentPage(1); }}
                                minW="80px"
                            >
                                Todos
                            </Button>
                        </Skeleton>

                        {isInitialLoading && activeDepartments.length === 0 ? (
                            <>
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} height="32px" width="180px" borderRadius="full" />
                                ))}
                            </>
                        ) : (
                            activeDepartments.map(dept => {
                                const isSelected = selectedDept === dept.id;
                                const isHovered = hoveredPillId === dept.id;
                                const IconComponent = (AnimatedIcons as Record<string, React.ElementType>)[dept.iconName] || AnimatedIcons.AnimatedBox;
                                const deptColor = dept.cardColorHex || '#3182CE';
                                return (
                                    <Skeleton key={dept.id} isLoaded={!isInitialLoading} borderRadius="full">
                                        <Button
                                            borderRadius="full" px={5} size="sm" fontWeight="bold" variant="outline"
                                            flexShrink={0} whiteSpace="nowrap"
                                            bg={isSelected ? (isDarkMode ? `${deptColor}33` : `${deptColor}22`) : theme.cardBg}
                                            color={isSelected ? theme.textPrimary : theme.textSecondary}
                                            borderColor={isSelected ? deptColor : theme.cardBorder}
                                            onClick={() => { setSelectedDept(dept.id); setCurrentPage(1); }}
                                            onMouseEnter={() => setHoveredPillId(dept.id)}
                                            onMouseLeave={() => setHoveredPillId(null)}
                                            leftIcon={<Box color={isSelected ? deptColor : theme.textSecondary}><IconComponent size={16} isHovered={isSelected || isHovered} /></Box>}
                                            boxShadow={isSelected ? `0 0 15px ${deptColor}88, inset 0 0 10px ${deptColor}44` : 'none'}
                                            _hover={{ borderColor: deptColor, bg: isDarkMode ? `${deptColor}33` : `${deptColor}22`, boxShadow: `0 0 15px ${deptColor}88, inset 0 0 10px ${deptColor}44`, transform: 'translateY(-2px)', color: theme.textPrimary }}
                                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                        >
                                            {dept.name}
                                        </Button>
                                    </Skeleton>
                                );
                            })
                        )}
                    </HStack>
                </Box>

                <HStack spacing={1} flexShrink={0} ml={4}>
                    <Skeleton isLoaded={!isInitialLoading} borderRadius="md">
                        <Button
                            leftIcon={<Box display="flex" alignItems="center"><AnimatedIcons.AnimatedTornado size={16} isHovered={isFilterBtnHovered} /></Box>}
                            size="sm"
                            variant="solid"
                            bg={isDarkMode ? 'white' : 'black'}
                            color={isDarkMode ? 'black' : 'white'}
                            _hover={{ opacity: 0.8 }}
                            onClick={onOpenFilter}
                            onMouseEnter={() => setIsFilterBtnHovered(true)}
                            onMouseLeave={() => setIsFilterBtnHovered(false)}
                            transition="all 0.2s"
                        >
                            Filtros Avançados
                        </Button>
                    </Skeleton>
                </HStack>
            </Flex>

            <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' } }}>
                {isInitialLoading ? (
                    <TableContainer bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder}>
                        <Table variant="simple" size="sm">
                            <Thead bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}>
                                <Tr>
                                    <Th>Data/Hora</Th>
                                    <Th>Ticket/Linha</Th>
                                    <Th>Departamento</Th>
                                    <Th>Abertura por</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {[...Array(8)].map((_, i) => (
                                    <TableRowSkeleton key={i} />
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : tickets.length === 0 ? (
                    <EmptyStateIndicator isDarkMode={isDarkMode} />
                ) : (
                    <Box position="relative" opacity={isFetching ? 0.5 : 1} pointerEvents={isFetching ? "none" : "auto"} transition="opacity 0.2s ease">
                    <TableContainer bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder}>
                        <Table variant="simple" size="sm">
                            <Thead bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}>
                                <Tr>
                                    <Th>Data/Hora</Th>
                                    <Th>Ticket/Linha</Th>
                                    <Th>Departamento</Th>
                                    <Th>Abertura por</Th>
                                    <Th>Status</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tickets.map(ticket => (
                                    <Tr key={ticket.id} _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "blackAlpha.50" }} cursor="pointer" onClick={() => handleTicketClick(ticket)}>
                                        <Td fontSize="sm">{ticket.openedAt}</Td>
                                        <Td fontWeight="bold" color={theme.textPrimary}>#{ticket.id} - {ticket.lineName}</Td>
                                        <Td>
                                            <Badge
                                                bg="transparent"
                                                border="1px solid"
                                                borderRadius="full"
                                                px={3}
                                                py={0.5}
                                                color={theme.textPrimary}
                                                borderColor={ticket.departmentColor}
                                                boxShadow={`0 0 10px ${ticket.departmentColor}88, inset 0 0 8px ${ticket.departmentColor}55`}
                                            >
                                                {ticket.departmentName}
                                            </Badge>
                                        </Td>
                                        <Td fontSize="sm">{ticket.openedBy}</Td>
                                        <Td>
                                            <HStack>
                                                <Box
                                                    w="8px"
                                                    h="8px"
                                                    borderRadius="full"
                                                    bg={ticket.statusColor}
                                                    color={ticket.statusColor}
                                                    boxShadow="0 0 6px currentColor, 0 0 12px currentColor"
                                                />
                                                <Text fontSize="xs" fontWeight="bold" color={theme.textPrimary}>{ticket.statusLabel}</Text>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    </Box>
                )}
            </Box>

            <Flex justify="center" align="center" mt={4} gap={4} flexShrink={0}>
                <Skeleton isLoaded={!isInitialLoading} borderRadius="md" display="flex" gap={4} alignItems="center">
                    <IconButton
                        aria-label="Anterior" icon={<ChevronLeft size={20} />} size="md" variant="outline" borderColor={theme.cardBorder}
                        isDisabled={currentPage === 1 || isFetching} onClick={() => setCurrentPage(p => p - 1)}
                    />
                    <Text fontSize="sm" fontWeight="bold" color={theme.textSecondary}>Página {currentPage} de {totalPages}</Text>
                    <IconButton
                        aria-label="Próxima" icon={<ChevronRight size={20} />} size="md" variant="outline" borderColor={theme.cardBorder}
                        isDisabled={currentPage === totalPages || isFetching} onClick={() => setCurrentPage(p => p + 1)}
                    />
                </Skeleton>
            </Flex>

            <TicketFilterDrawer
                isOpen={isFilterOpen}
                onClose={onCloseFilter}
                searchQuery={searchInput}
                onSearchChange={(val) => { setSearchInput(val); setCurrentPage(1); }}
                departments={activeDepartments}
                dynamicFilters={dynamicFilters}
                onDynamicFilterChange={handleDynamicFilterChange}
                onClearFilters={handleClearFilters}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={(val) => { setStartDate(val); setCurrentPage(1); }}
                onEndDateChange={(val) => { setEndDate(val); setCurrentPage(1); }}
            />

            <TicketDetailsModal
                isOpen={isDetailsOpen}
                onClose={onCloseDetails}
                selectedTicket={selectedTicket}
                actionLoadingId={null}
                handleTicketAction={() => { }}
                animatingBite={false}
                animatingTear={false}
                onOpenFeedback={(id) => {
                    setFeedbackTicketId(id);
                    setIsFeedbackOpen(true);
                }}
            />

            <TicketFeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                ticketId={feedbackTicketId}
                onSubmitFeedback={handleSubmitFeedback}
            />
        </Flex>
    );
};