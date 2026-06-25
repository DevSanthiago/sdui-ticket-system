import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box, Flex, Heading, Text, HStack, IconButton, Button, VStack,
    SimpleGrid, Badge, Icon, Table, Thead, Tbody, Tr, Th, Td,
    TableContainer, Center, Skeleton
} from '@chakra-ui/react';
import { LayoutGrid, List, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TicketStatus } from '../../types/models.types';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useAuth } from '../../hooks/auth/useAuth';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { TicketDetailsModal } from '../../components/tickets/TicketDetailsModal';
import { TicketSuccessModal } from '../../components/tickets/TicketSuccessModal';
import { TicketFeedbackModal } from '../../components/tickets/TicketFeedbackModal';
import { useTicketBoard } from '../../hooks/tickets/useTicketBoard';
import type { DynamicField } from '../../types';
import type { AvailableIconName } from '../../types/ui.types';
import { api } from '../../services/api/api';
import { API_ENDPOINTS } from '../../constants/endpoints/apiEndpoints';
import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { Alert } from '../../services/alerts/alertService';

const EmptyStateIndicator = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [isAnimated, setIsAnimated] = useState(false);
    useEffect(() => {
        const startTimer = setTimeout(() => setIsAnimated(true), 0);
        const endTimer = setTimeout(() => setIsAnimated(false), 2000);
        return () => { clearTimeout(startTimer); clearTimeout(endTimer); };
    }, []);

    const activeColor = isDarkMode ? "#48BB78" : "#276d21ff";
    const iconGlow = isDarkMode ? `drop-shadow(0 0 16px ${activeColor}) drop-shadow(0 0 4px ${activeColor})` : `drop-shadow(0 0 4px rgba(75, 83, 32, 0.4))`;
    const textGlow = isDarkMode ? `0 0 10px ${activeColor}` : `0 0 2px rgba(75, 83, 32, 0.3)`;

    return (
        <Center h="100%">
            <VStack spacing={6} onMouseEnter={() => setIsAnimated(true)} onMouseLeave={() => setIsAnimated(false)} cursor="default">
                <Box color={activeColor} style={{ filter: iconGlow }} transition="all 0.3s ease" transform={isAnimated ? "scale(1.05)" : "scale(1)"}>
                    <AnimatedIcons.AnimatedCircleCheck size={84} isHovered={isAnimated} />
                </Box>
                <Text color={activeColor} fontSize="lg" fontWeight="bold" textShadow={textGlow} transition="all 0.3s ease" letterSpacing="wide" textAlign="center" px={4} maxW="420px">
                    Parabéns! Nenhum ticket pendente foi encontrado no filtro selecionado
                </Text>
            </VStack>
        </Center>
    );
};

export const TicketBoard = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();
    const { user } = useAuth();
    const canManageTickets = user?.canManageTickets === true;
    const isKiosk = localStorage.getItem(STORAGE_KEYS.KIOSK) === "true";

    const {
        activeDepartments, tickets, isLoadingTickets, selectedDept, setSelectedDept,
        actionLoadingId, selectedTicket, handleTicketClick, handleTicketAction,
        isDetailsOpen, onCloseDetails, animatingBite, animatingTear,
        isReceiptOpen, receiptTicketData, onCloseReceipt
    } = useTicketBoard();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isHeaderIconHovered, setIsHeaderIconHovered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredPillId, setHoveredPillId] = useState<number | null>(null);
    const cardsPerPage = 8;

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackTicketId, setFeedbackTicketId] = useState<number | null>(null);

    const handleSubmitFeedback = async (id: number, feedback: string) => {
        try {
            await api.patch(API_ENDPOINTS.TICKETS.FEEDBACK(id), { feedback });
            Alert.toast('Feedback registrado no histórico!', 'success', isDarkMode);
        } catch (error) {
            console.error("Erro ao salvar feedback", error);
            Alert.error('Erro', 'Não foi possível salvar as observações.', isDarkMode);
        }
    };

    useEffect(() => {
        if (!isLoadingTickets) {
            const startTimer = setTimeout(() => setIsHeaderIconHovered(true), 0);
            const endTimer = setTimeout(() => setIsHeaderIconHovered(false), 1500);
            return () => { clearTimeout(startTimer); clearTimeout(endTimer); };
        }
    }, [isLoadingTickets]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesDept = selectedDept ? t.departmentId === selectedDept : true;
            const isPending = t.status !== TicketStatus.Resolved;
            return matchesDept && isPending;
        });
    }, [selectedDept, tickets]);

    const totalPages = Math.ceil(filteredTickets.length / cardsPerPage) || 1;
    const currentTickets = filteredTickets.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

    return (
        <Flex direction="column" w="100%" h="100%" p={{ base: 4, md: 8 }} bg={theme.bgApp} overflow="hidden">
            <Box mb={6} flexShrink={0}>
                {isLoadingTickets ? (
                    <>
                        <Flex justify="space-between" align="center" mb={2}>
                            <HStack spacing={4}>
                                <Skeleton boxSize="40px" borderRadius="md" />
                                <Skeleton boxSize="32px" borderRadius="md" />
                                <Skeleton height="32px" width="220px" borderRadius="md" />
                            </HStack>
                        </Flex>
                        <Skeleton height="20px" width="320px" ml={14} mt={2} borderRadius="md" />
                    </>
                ) : (
                    <>
                        <Flex justify="space-between" align="center" mb={2}>
                            <HStack spacing={4}>
                                {!isKiosk && (
                                    <IconButton aria-label="Voltar" icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />} onClick={() => navigate('/')} variant="ghost" color={theme.textPrimary} _hover={{ bg: isDarkMode ? "whiteAlpha.200" : "blackAlpha.100" }} onMouseEnter={() => setIsBackHovered(true)} onMouseLeave={() => setIsBackHovered(false)} />
                                )}
                                <Box color={theme.iconColor} display="flex" alignItems="center" onMouseEnter={() => setIsHeaderIconHovered(true)} onMouseLeave={() => setIsHeaderIconHovered(false)}>
                                    <AnimatedIcons.AnimatedGalleryVerticalEnd size={32} isHovered={isHeaderIconHovered} />
                                </Box>
                                <Heading size="lg" color={theme.textPrimary}>Painel de Tickets</Heading>
                            </HStack>
                        </Flex>
                        <Text color={theme.textSecondary} fontSize="md" ml={14}>Acompanhe e gerencie os tickets da fábrica</Text>
                    </>
                )}
            </Box>

            <Flex justify="space-between" align="center" mb={4} gap={4} px={1}>
                <Box flex={1} overflowX="auto" py={5} px={3} my={-5} mx={-3} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                    <HStack spacing={3}>
                        {isLoadingTickets ? (
                            [...Array(8)].map((_, index) => <Skeleton key={index} height="32px" width="140px" borderRadius="full" />)
                        ) : (
                            activeDepartments.map(dept => {
                                const isSelected = selectedDept === dept.id;
                                const isHovered = hoveredPillId === dept.id;
                                const IconComponent = AnimatedIcons[dept.iconName as AvailableIconName] ?? AnimatedIcons.AnimatedBox;
                                const deptColor = dept.cardColorHex || '#3182CE';
                                return (
                                    <Button
                                        key={dept.id} borderRadius="full" px={5} size="sm" fontWeight="bold" variant="outline"
                                        flexShrink={0} whiteSpace="nowrap"
                                        bg={isSelected ? (isDarkMode ? `${deptColor}33` : `${deptColor}22`) : theme.cardBg}
                                        color={isSelected ? theme.textPrimary : theme.textSecondary}
                                        borderColor={isSelected ? deptColor : theme.cardBorder}
                                        onClick={() => { setSelectedDept(dept.id); setCurrentPage(1); }}
                                        onMouseEnter={() => setHoveredPillId(dept.id)} onMouseLeave={() => setHoveredPillId(null)}
                                        leftIcon={<Box color={isSelected ? deptColor : theme.textSecondary}><IconComponent size={16} isHovered={isSelected || isHovered} /></Box>}
                                        boxShadow={isSelected ? `0 0 15px ${deptColor}88, inset 0 0 10px ${deptColor}44` : 'none'}
                                        _hover={{ borderColor: deptColor, bg: isDarkMode ? `${deptColor}33` : `${deptColor}22`, boxShadow: `0 0 15px ${deptColor}88, inset 0 0 10px ${deptColor}44`, transform: 'translateY(-1px)', color: theme.textPrimary }}
                                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                    >
                                        {dept.name}
                                    </Button>
                                );
                            })
                        )}
                    </HStack>
                </Box>

                <HStack spacing={3} flexShrink={0}>
                    <Flex position="relative" bg={theme.cardBg} p="4px" borderRadius="full" borderWidth="1px" borderColor={theme.cardBorder} align="center">
                        <motion.div
                            initial={false} animate={{ x: viewMode === 'grid' ? 0 : 36 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            style={{ position: 'absolute', width: '32px', height: '32px', backgroundColor: isDarkMode ? 'white' : 'black', borderRadius: '9999px', boxShadow: theme.toggleActiveShadow, zIndex: 0 }}
                        />
                        <IconButton aria-label="Grid" icon={<LayoutGrid size={16} />} size="sm" variant="unstyled" display="flex" justifyContent="center" alignItems="center" w="32px" h="32px" minW="32px" zIndex={1} color={viewMode === 'grid' ? (isDarkMode ? 'black' : 'white') : theme.textSecondary} transition="color 0.3s ease" onClick={() => setViewMode('grid')} />
                        <Box w="4px" />
                        <IconButton aria-label="Lista" icon={<List size={16} />} size="sm" variant="unstyled" display="flex" justifyContent="center" alignItems="center" w="32px" h="32px" minW="32px" zIndex={1} color={viewMode === 'list' ? (isDarkMode ? 'black' : 'white') : theme.textSecondary} transition="color 0.3s ease" onClick={() => setViewMode('list')} />
                    </Flex>
                </HStack>
            </Flex>

            <Box flex={1} overflowY="auto" overflowX="hidden" p={{ base: 4, md: 6 }} m={{ base: -4, md: -6 }} css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' } }}>
                {isLoadingTickets ? (
                    viewMode === 'grid' ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                            {[...Array(8)].map((_, index) => (
                                <Box key={index} bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} p={4}>
                                    <Flex justify="space-between" align="start" mb={3}>
                                        <VStack align="start" spacing={2} w="full">
                                            <HStack spacing={2} w="full"><Skeleton height="16px" width="40px" /><Skeleton height="20px" width="120px" /></HStack>
                                            <Skeleton height="12px" width="100px" />
                                        </VStack>
                                        <Skeleton boxSize="24px" borderRadius="md" />
                                    </Flex>
                                    <VStack align="stretch" spacing={2} mb={4}>
                                        <Skeleton height="28px" borderRadius="md" /><Skeleton height="28px" borderRadius="md" /><Skeleton height="28px" borderRadius="md" />
                                    </VStack>
                                    <Flex justify="flex-start" align="center"><Skeleton height="20px" width="80px" /></Flex>
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : (
                        <TableContainer bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder}>
                            <Table variant="simple" size="md">
                                <Thead bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}><Tr><Th>Ticket</Th><Th>Departamento</Th><Th>Status</Th></Tr></Thead>
                                <Tbody>
                                    {[...Array(8)].map((_, index) => (
                                        <Tr key={index}>
                                            <Td><HStack spacing={4}><Skeleton boxSize="28px" borderRadius="md" /><VStack align="start" spacing={1}><Skeleton height="16px" width="120px" /><Skeleton height="12px" width="80px" /></VStack></HStack></Td>
                                            <Td><Skeleton height="24px" width="100px" borderRadius="md" /></Td>
                                            <Td><Skeleton height="20px" width="80px" /></Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )
                ) : filteredTickets.length === 0 ? (
                    <EmptyStateIndicator isDarkMode={isDarkMode} />
                ) : viewMode === 'grid' ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                        {currentTickets.map(ticket => (
                            <Box key={ticket.id} bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} borderLeftWidth="4px" borderLeftColor={ticket.departmentColor} p={4} transition="all 0.2s" cursor="pointer" onClick={() => handleTicketClick(ticket)} position="relative" role="group" _hover={{ transform: 'translateY(-2px)', borderColor: ticket.departmentColor, boxShadow: `0 0 15px ${ticket.departmentColor}88, inset 0 0 8px ${ticket.departmentColor}55` }}>
                                <Flex justify="space-between" align="start" mb={3}>
                                    <VStack align="start" spacing={0}>
                                        <HStack spacing={2}><Text fontSize="sm" fontWeight="bold" color={theme.textSecondary}>#{ticket.id}</Text><Text fontSize="md" fontWeight="bold" color={theme.textPrimary}>{ticket.lineName}</Text></HStack>
                                        <Text fontSize="xs" color={theme.textSecondary}>{ticket.openedAt}</Text>
                                    </VStack>
                                    <Flex align="center" justify="center" w="24px" h="24px" borderRadius="md" bg={isDarkMode ? 'whiteAlpha.100' : 'blackAlpha.50'} _groupHover={{ bg: ticket.departmentColor, color: 'white' }} transition="all 0.2s"><Icon as={Maximize2} size={12} color={theme.textSecondary} _groupHover={{ color: 'white' }} /></Flex>
                                </Flex>
                                <VStack align="stretch" spacing={1.5} mb={4}>
                                    {ticket.dynamicFields.slice(0, 3).map((f: DynamicField, i: number) => (
                                        <Flex key={i} bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"} px={3} py={1.5} borderRadius="md" justify="space-between" align="center">
                                            <Text fontSize="10px" fontWeight="bold" color={theme.textSecondary} textTransform="uppercase" maxW="35%" isTruncated>{f.label}</Text>
                                            <Text fontSize="xs" fontWeight="medium" color={theme.textPrimary} maxW="60%" textAlign="right" isTruncated>{f.value}</Text>
                                        </Flex>
                                    ))}
                                </VStack>
                                <Flex justify="flex-start" align="center">
                                    <HStack spacing={1.5}>
                                        <Box w="8px" h="8px" borderRadius="full" bg={ticket.status === TicketStatus.Open ? 'orange.400' : 'blue.400'} color={ticket.status === TicketStatus.Open ? 'orange.400' : 'blue.400'} boxShadow="0 0 6px currentColor, 0 0 12px currentColor" />
                                        <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>{ticket.status === TicketStatus.Open ? 'Aguardando' : 'Em atendimento'}</Text>
                                    </HStack>
                                </Flex>
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : (
                    <TableContainer bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder}>
                        <Table variant="simple" size="md">
                            <Thead bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}><Tr><Th>Ticket</Th><Th>Departamento</Th><Th>Status</Th></Tr></Thead>
                            <Tbody>
                                {currentTickets.map(ticket => (
                                    <Tr key={ticket.id} _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "blackAlpha.50" }} cursor="pointer" onClick={() => handleTicketClick(ticket)} role="group">
                                        <Td>
                                            <HStack spacing={4}>
                                                <Flex align="center" justify="center" w="28px" h="28px" borderRadius="md" bg={isDarkMode ? 'whiteAlpha.100' : 'blackAlpha.50'} _groupHover={{ bg: ticket.departmentColor, color: 'white' }} transition="all 0.2s"><Icon as={Maximize2} size={14} color={theme.textSecondary} _groupHover={{ color: 'white' }} /></Flex>
                                                <VStack align="start" spacing={0}><Text fontWeight="bold" fontSize="sm" color={theme.textPrimary}>#{ticket.id} - {ticket.lineName}</Text><Text fontSize="xs" color={theme.textSecondary}>{ticket.openedBy}</Text></VStack>
                                            </HStack>
                                        </Td>
                                        <Td><Badge bg="transparent" border="1px solid" borderRadius="full" px={3} py={0.5} color={theme.textPrimary} borderColor={ticket.departmentColor} boxShadow={`0 0 10px ${ticket.departmentColor}88, inset 0 0 8px ${ticket.departmentColor}55`}>{ticket.departmentName}</Badge></Td>
                                        <Td>
                                            <HStack>
                                                <Box w="8px" h="8px" borderRadius="full" bg={ticket.status === TicketStatus.Open ? 'orange.400' : ticket.status === TicketStatus.InProgress ? 'blue.400' : 'green.500'} color={ticket.status === TicketStatus.Open ? 'orange.400' : ticket.status === TicketStatus.InProgress ? 'blue.400' : 'green.500'} boxShadow="0 0 6px currentColor, 0 0 12px currentColor" />
                                                <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>{ticket.status === TicketStatus.Open ? 'Aguardando' : ticket.status === TicketStatus.InProgress ? 'Em Atendimento' : 'Concluído'}</Text>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            <Flex justify="center" align="center" mt={6} gap={4} flexShrink={0}>
                <IconButton aria-label="Anterior" icon={<ChevronLeft size={20} />} size="md" variant="outline" borderColor={theme.cardBorder} isDisabled={currentPage === 1 || isLoadingTickets} onClick={() => setCurrentPage(p => p - 1)} />
                {isLoadingTickets ? <Skeleton height="20px" width="100px" /> : <Text fontSize="sm" fontWeight="bold" color={theme.textSecondary}>Página {currentPage} de {totalPages}</Text>}
                <IconButton aria-label="Próxima" icon={<ChevronRight size={20} />} size="md" variant="outline" borderColor={theme.cardBorder} isDisabled={currentPage === totalPages || isLoadingTickets} onClick={() => setCurrentPage(p => p + 1)} />
            </Flex>

            <TicketDetailsModal
                isOpen={isDetailsOpen}
                onClose={onCloseDetails}
                selectedTicket={selectedTicket}
                actionLoadingId={actionLoadingId}
                handleTicketAction={(ticket, e) => handleTicketAction(ticket, e, isDarkMode)}
                animatingBite={animatingBite}
                animatingTear={animatingTear}
                canManageTickets={canManageTickets}
            />

            <TicketSuccessModal
                isOpen={isReceiptOpen}
                onClose={() => {
                    onCloseReceipt();
                    if (receiptTicketData?.status === TicketStatus.Resolved) {
                        setFeedbackTicketId(Number(receiptTicketData.id));
                        setIsFeedbackOpen(true);
                    }
                }}
                ticketData={receiptTicketData}
                actionType={receiptTicketData?.status === TicketStatus.InProgress ? 'start' : 'resolve'}
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