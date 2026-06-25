import {
    Box, Heading, Text, Button, Flex, Icon, Badge, Center, Skeleton, SkeletonCircle,
    useDisclosure, VStack, StackDivider, Input, InputGroup, InputLeftElement, HStack, IconButton
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { ElementType } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FaClock, FaSearch, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import {
    AnimatedArrowBigUpDash, AnimatedFileCheck2, AnimatedEye,
    AnimatedChevronLeft, AnimatedMailbox, AnimatedFileText
} from "../../components/icons/NewAnimatedIcons";
import { StaticFileText } from "../../components/icons/StaticIcons";
import { ChecklistForm } from "../../components/layout/ChecklistForm";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useAuth } from "../../hooks/auth/useAuth";
import { api } from "../../services/api/api";
import { Alert } from "../../services/alerts/alertService";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import { AxiosError } from "axios";
import { ChecklistStatus, type Ticket, type ApiErrorResponse } from "../../types";

type InboxView = 'toFill' | 'received';

interface InboxData {
    toFill: Ticket[];
    received: Ticket[];
    counts: { toFill: number; received: number };
}

const TicketActionButton = ({ onClick, isPending }: { onClick: () => void; isPending: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);
    const theme = useMinimalTheme();

    const IconComponent: ElementType = isPending ? AnimatedArrowBigUpDash : AnimatedEye;

    return (
        <Button
            size="sm"
            bg={theme.buttonBg}
            color={theme.textPrimary}
            borderWidth="1px"
            borderColor={theme.cardBorder}
            _hover={{ bg: theme.buttonHoverBg }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            leftIcon={<IconComponent size={18} isHovered={isHovered} />}
            onClick={onClick}
            minW={{ base: "full", md: "180px" }}
            transition="all 0.2s"
        >
            {isPending ? "Preencher e Enviar" : "Visualizar"}
        </Button>
    );
};

const InboxEmptyState = ({ isDarkMode, viewMode }: { isDarkMode: boolean; viewMode: InboxView }) => {
    const activeColor = isDarkMode ? "#B794F4" : "#805AD5";
    const glow = `0 0 15px ${activeColor}88`;

    return (
        <Center minH="60vh" textAlign="center">
            <VStack spacing={6}>
                <Box color={activeColor} filter={`drop-shadow(0 0 15px ${activeColor}88)`} pointerEvents="none">
                    <AnimatedFileText isHovered size={96} />
                </Box>
                <VStack spacing={1} px={4}>
                    <Heading size="lg" color={activeColor} textShadow={glow} letterSpacing="wide" textAlign="center">
                        Nenhum item encontrado
                    </Heading>
                    <Text color={activeColor} textShadow={glow} opacity={0.85} textAlign="center" maxW="420px">
                        {viewMode === 'toFill'
                            ? "Você não possui checklists pendentes para preencher"
                            : "Você ainda não recebeu checklists preenchidos"}
                    </Text>
                </VStack>
            </VStack>
        </Center>
    );
};

const InboxSkeleton = () => {
    const theme = useMinimalTheme();

    return (
        <Box p={{ base: 4, md: 8 }} w="100%" bg={theme.bgApp} minH="100vh">
            <Box mb={6}>
                <HStack spacing={3} mb={2}>
                    <Skeleton w="40px" h="40px" borderRadius="md" />
                    <SkeletonCircle size="8" />
                    <Skeleton h="28px" w="220px" borderRadius="md" />
                </HStack>
                <Skeleton h="18px" w={{ base: "80%", md: "460px" }} borderRadius="md" />
            </Box>

            <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }} gap={3} mb={4} wrap="wrap">
                <Skeleton h="40px" w={{ base: "full", md: "320px" }} borderRadius="md" ml={{ md: "auto" }} />
                <Skeleton h="40px" w="272px" maxW="full" borderRadius="md" alignSelf={{ base: "flex-start", md: "auto" }} />
            </Flex>

            <VStack spacing={0} align="stretch" bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} divider={<StackDivider borderColor={theme.cardBorder} />} overflow="hidden" mb={4}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Flex key={i} p={4} align="center" justify="space-between" gap={4}>
                        <Flex gap={4} align="center" flex={1}>
                            <Skeleton h="28px" w="80px" borderRadius="md" />
                            <Box>
                                <Skeleton h="16px" w="140px" mb={2} borderRadius="md" />
                                <Skeleton h="12px" w="180px" borderRadius="md" />
                            </Box>
                        </Flex>
                        <Box flex={1} display={{ base: "none", md: "block" }}>
                            <Skeleton h="14px" w="200px" mb={2} borderRadius="md" />
                            <Skeleton h="18px" w="90px" borderRadius="full" />
                        </Box>
                        <Skeleton h="32px" w="180px" borderRadius="md" />
                    </Flex>
                ))}
            </VStack>
        </Box>
    );
};

export const ChecklistPage = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { user: currentUser } = useAuth();

    const [viewMode, setViewMode] = useState<InboxView>('toFill');
    const [searchTerm, setSearchTerm] = useState("");

    const [isBackHovered, setIsBackHovered] = useState(false);
    const [mailboxAnimate, setMailboxAnimate] = useState(false);
    const [isSentHovered, setIsSentHovered] = useState(false);
    const [isReceivedHovered, setIsReceivedHovered] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const [inbox, setInbox] = useState<InboxData>({ toFill: [], received: [], counts: { toFill: 0, received: 0 } });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode, searchTerm]);

    const fetchInbox = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get<InboxData>(API_ENDPOINTS.CHECKLISTS.INBOX);
            setInbox({
                toFill: data.toFill ?? [],
                received: data.received ?? [],
                counts: data.counts ?? { toFill: 0, received: 0 },
            });
        } catch (error) {
            const err = error as AxiosError<ApiErrorResponse>;
            Alert.toast(err.response?.data?.message || "Erro ao carregar a caixa de entrada", "error", isDarkMode);
        } finally {
            setIsLoading(false);
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (currentUser) fetchInbox();
    }, [currentUser, fetchInbox]);

    useEffect(() => {
        if (isLoading) return;
        const start = setTimeout(() => setMailboxAnimate(true), 150);
        const stop = setTimeout(() => setMailboxAnimate(false), 1100);
        return () => { clearTimeout(start); clearTimeout(stop); };
    }, [isLoading]);

    const activeList = viewMode === 'toFill' ? inbox.toFill : inbox.received;

    const filteredTickets = useMemo(() => {
        if (!searchTerm) return activeList;
        const q = searchTerm.toLowerCase();
        return activeList.filter(t =>
            t.id.toString().includes(q) ||
            t.lineName?.toLowerCase().includes(q) ||
            (t.departmentName && t.departmentName.toLowerCase().includes(q)) ||
            (t.monitorName && t.monitorName.toLowerCase().includes(q))
        );
    }, [activeList, searchTerm]);

    const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
    const paginatedTickets = filteredTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const greenNeon = isDarkMode ? "#48BB78" : "#2F855A";
    const orangeNeon = isDarkMode ? "#ED8936" : "#C05621";

    const toFillCount = inbox.counts.toFill;
    const receivedCount = inbox.counts.received;

    const fillMessage = toFillCount === 1
        ? "Você possui 1 checklist a ser preenchido"
        : `Você possui ${toFillCount} checklists a serem preenchidos`;
    const receivedMessage = receivedCount === 1
        ? "Você recebeu 1 checklist preenchido"
        : `Você recebeu ${receivedCount} checklists preenchidos`;

    const activeCount = viewMode === 'toFill' ? toFillCount : receivedCount;
    const activeMessage = viewMode === 'toFill' ? fillMessage : receivedMessage;

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        onOpen();
    };

    if (isLoading) return <InboxSkeleton />;

    return (
        <Box p={{ base: 4, md: 8 }} w="100%" bg={theme.bgApp} minH="100vh">
            <Box mb={6}>
                <HStack spacing={3} mb={2}>
                    <IconButton
                        aria-label="Voltar para a página anterior"
                        icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                        onClick={() => navigate(-1)}
                        variant="ghost" color={theme.textPrimary}
                        _hover={{ bg: theme.buttonHoverBg }}
                        onMouseEnter={() => setIsBackHovered(true)}
                        onMouseLeave={() => setIsBackHovered(false)}
                    />
                    <Box color={theme.iconColor} display="flex" alignItems="center" justifyContent="center">
                        <AnimatedMailbox size={32} isHovered={mailboxAnimate} />
                    </Box>
                    <Heading size="lg" color={theme.textPrimary}>Caixa de Entrada</Heading>
                </HStack>
                <Text color={theme.textSecondary}>
                    Gerencie notificações e preencha checklists na inbox do Ticket System
                </Text>
            </Box>

            <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }} gap={3} mb={4} wrap="wrap">
                {activeCount > 0 && (
                    <HStack spacing={2} color={theme.textPrimary} pointerEvents="none">
                        <StaticFileText size={20} />
                        <Text fontWeight="medium">{activeMessage}</Text>
                    </HStack>
                )}
                <InputGroup w={{ base: "full", md: "320px" }} ml={{ md: "auto" }}>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar por ID, Linha ou Monitor..."
                        bg={theme.cardBg}
                        borderColor={theme.cardBorder}
                        color={theme.textPrimary}
                        focusBorderColor={theme.inputFocusBorder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

                <Box position="relative" display="inline-flex" p="3px" bg={theme.cardBg} borderRadius="md" borderWidth="1px" borderColor={theme.cardBorder} alignItems="center" alignSelf={{ base: "flex-start", md: "auto" }}>
                    <motion.div
                        initial={false}
                        animate={{ x: viewMode === 'toFill' ? 0 : 132 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                            position: 'absolute', top: '3px', left: '3px', width: '132px', height: 'calc(100% - 6px)',
                            backgroundColor: isDarkMode ? 'white' : 'black', borderRadius: '6px',
                            boxShadow: theme.toggleActiveShadow, zIndex: 0
                        }}
                    />
                    <Button
                        size="sm" w="132px" variant="ghost" zIndex={1}
                        onMouseEnter={() => setIsSentHovered(true)}
                        onMouseLeave={() => setIsSentHovered(false)}
                        leftIcon={<AnimatedArrowBigUpDash size={18} isHovered={isSentHovered} />}
                        onClick={() => setViewMode('toFill')}
                        color={viewMode === 'toFill' ? theme.toggleActiveColor : theme.textPrimary}
                        bg="transparent" _hover={{ bg: "transparent" }} _active={{ bg: "transparent" }}
                        transition="color 0.3s ease"
                    >
                        Enviar
                    </Button>
                    <Button
                        size="sm" w="132px" variant="ghost" zIndex={1}
                        onMouseEnter={() => setIsReceivedHovered(true)}
                        onMouseLeave={() => setIsReceivedHovered(false)}
                        leftIcon={<AnimatedFileCheck2 size={18} isHovered={isReceivedHovered} />}
                        onClick={() => setViewMode('received')}
                        color={viewMode === 'received' ? theme.toggleActiveColor : theme.textPrimary}
                        bg="transparent" _hover={{ bg: "transparent" }} _active={{ bg: "transparent" }}
                        transition="color 0.3s ease"
                    >
                        Recebidos
                    </Button>
                </Box>
            </Flex>

            {filteredTickets.length === 0 ? (
                <InboxEmptyState isDarkMode={isDarkMode} viewMode={viewMode} />
            ) : (
                <VStack spacing={0} align="stretch" bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} divider={<StackDivider borderColor={theme.cardBorder} />} overflow="hidden" mb={4}>
                    {paginatedTickets.map((ticket) => (
                        <Flex key={ticket.id} p={4} align="center" justify="space-between" gap={4} transition="all 0.2s" _hover={{ bg: theme.buttonHoverBg }} direction={{ base: "column", md: "row" }}>
                            <Flex gap={4} align="center" flex={1}>
                                {(() => {
                                    const badgeColor = ticket.checklistStatus === ChecklistStatus.Completed ? greenNeon : orangeNeon;
                                    return (
                                        <Badge
                                            px={2} py={1} borderRadius="md" minW="80px" textAlign="center"
                                            bg="transparent" color={badgeColor} border="1px solid" borderColor={badgeColor}
                                            boxShadow={`0 0 8px ${badgeColor}66, 0 0 2px ${badgeColor}`}
                                        >
                                            ID: {ticket.id}
                                        </Badge>
                                    );
                                })()}
                                <Box>
                                    <Heading size="sm" mb={1} color={theme.textPrimary}>{ticket.lineName}</Heading>
                                    <Text fontSize="xs" color={theme.textSecondary} display="flex" alignItems="center" gap={1}>
                                        <Icon as={FaClock} />
                                        {ticket.checklistStatus === ChecklistStatus.Pending ? "Aguardando preenchimento" : `Checklist gerado em ${new Date(ticket.createdAt).toLocaleDateString()}`}
                                    </Text>
                                </Box>
                            </Flex>

                            <Box flex={1} display={{ base: "none", md: "block" }}>
                                <Text fontSize="sm" color={theme.textSecondary}>
                                    {ticket.checklistStatus === ChecklistStatus.Pending ? (
                                        <><Text as="span" fontWeight="bold">Técnico responsável:</Text> {ticket.technicianName}</>
                                    ) : (
                                        <><Text as="span" fontWeight="bold">Preenchido por:</Text> {ticket.monitorName || `Monitor #${ticket.monitorId}`}</>
                                    )}
                                </Text>
                                <Flex align="center" gap={2} mt={1} wrap="wrap">
                                    <Badge bg={theme.badgeBg} color={theme.textPrimary} border="1px solid" borderColor={theme.badgeBorder}>{ticket.departmentName || "Setup"}</Badge>
                                </Flex>
                            </Box>

                            <TicketActionButton onClick={() => handleTicketClick(ticket)} isPending={ticket.checklistStatus === ChecklistStatus.Pending} />
                        </Flex>
                    ))}
                </VStack>
            )}

            {filteredTickets.length > 0 && (
                <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="sm" color={theme.textSecondary}>
                        Mostrando {paginatedTickets.length} de {filteredTickets.length} registros
                    </Text>
                    <HStack spacing={2}>
                        <IconButton aria-label="Página anterior" icon={<FaChevronLeft />} size="sm" bg={theme.buttonBg} color={theme.textPrimary} isDisabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
                        <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>{currentPage} de {totalPages}</Text>
                        <IconButton aria-label="Próxima página" icon={<FaChevronRight />} size="sm" bg={theme.buttonBg} color={theme.textPrimary} isDisabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
                    </HStack>
                </Flex>
            )}

            <ChecklistForm isOpen={isOpen} onClose={onClose} ticket={selectedTicket} currentUser={currentUser} onSuccess={fetchInbox} />
        </Box>
    );
};
