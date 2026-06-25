import {
    Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Text,
    HStack, Badge, Button, Icon, VStack, Flex
} from '@chakra-ui/react';
import { AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { useTicketTable } from '../../hooks/tickets/useTicketTable';
import type { MockTicket } from '../../types';

interface TicketTableProps {
    tickets: MockTicket[];
    onTicketClick?: (ticket: MockTicket) => void;
}

export const TicketTable = ({ tickets, onTicketClick }: TicketTableProps) => {
    const { theme, isDarkMode, getStatusConfig } = useTicketTable();

    // Early return limpo para o estado vazio
    if (tickets.length === 0) {
        return (
            <Flex justify="center" align="center" h="200px" borderWidth="1px" borderColor={theme.cardBorder} borderRadius="xl" borderStyle="dashed">
                <Text color={theme.textSecondary}>Nenhum ticket encontrado.</Text>
            </Flex>
        );
    }

    return (
        <Box bg={theme.cardBg} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} overflow="hidden">
            <TableContainer>
                <Table variant="simple" size="md">
                    <Thead bg={isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50'}>
                        <Tr>
                            <Th color={theme.textSecondary} fontSize="xs" borderBottomColor={theme.cardBorder}>ID / Linha</Th>
                            <Th color={theme.textSecondary} fontSize="xs" borderBottomColor={theme.cardBorder}>Departamento</Th>
                            <Th color={theme.textSecondary} fontSize="xs" borderBottomColor={theme.cardBorder}>Solicitante</Th>
                            <Th color={theme.textSecondary} fontSize="xs" borderBottomColor={theme.cardBorder}>Status</Th>
                            <Th color={theme.textSecondary} fontSize="xs" borderBottomColor={theme.cardBorder} isNumeric>Ação</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tickets.map((ticket) => {
                            // Extraímos as configurações de status para a linha atual usando o Hook
                            const { label: statusLabel, color: statusColor } = getStatusConfig(ticket.status);

                            return (
                                <Tr
                                    key={ticket.id}
                                    _hover={{ bg: isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50' }}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                    onClick={() => onTicketClick && onTicketClick(ticket)}
                                >
                                    <Td borderBottomColor={theme.cardBorder} py={4}>
                                        <VStack align="start" spacing={1}>
                                            <HStack spacing={2}>
                                                <Text fontSize="sm" fontWeight="bold" color={theme.textSecondary}>
                                                    #{ticket.id}
                                                </Text>
                                                <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                                                    {ticket.lineName}
                                                </Text>
                                            </HStack>
                                            {ticket.isLineStopped && (
                                                <Badge colorScheme="red" variant="subtle" px={2} py={0.5} borderRadius="sm" display="flex" alignItems="center" gap={1}>
                                                    <Icon as={AlertTriangle} size={10} />
                                                    <Text fontSize="2xs" fontWeight="bold">LINHA PARADA</Text>
                                                </Badge>
                                            )}
                                        </VStack>
                                    </Td>

                                    <Td borderBottomColor={theme.cardBorder}>
                                        <HStack spacing={2}>
                                            <Box w="8px" h="8px" borderRadius="full" bg={ticket.departmentColor} boxShadow={`0 0 6px ${ticket.departmentColor}`} />
                                            <Text fontSize="sm" color={theme.textPrimary} fontWeight="medium">
                                                {ticket.departmentName}
                                            </Text>
                                        </HStack>
                                    </Td>

                                    <Td borderBottomColor={theme.cardBorder}>
                                        <VStack align="start" spacing={1}>
                                            <Text fontSize="sm" color={theme.textPrimary}>
                                                {ticket.openedBy}
                                            </Text>
                                            <HStack spacing={1} color={theme.textSecondary}>
                                                <Icon as={Clock} size={12} />
                                                <Text fontSize="xs">{ticket.openedAt}</Text>
                                            </HStack>
                                        </VStack>
                                    </Td>

                                    <Td borderBottomColor={theme.cardBorder}>
                                        <HStack spacing={2}>
                                            <Box w="6px" h="6px" borderRadius="full" bg={`${statusColor}.500`} />
                                            <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                                                {statusLabel}
                                            </Text>
                                        </HStack>
                                    </Td>

                                    <Td borderBottomColor={theme.cardBorder} isNumeric>
                                        <Button
                                            size="sm"
                                            bg={theme.buttonBg}
                                            color={theme.textPrimary}
                                            borderColor={theme.cardBorder}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            rightIcon={<Icon as={ArrowRight} size={14} />}
                                            _hover={{ bg: isDarkMode ? 'white' : 'black', color: isDarkMode ? 'black' : 'white' }}
                                            transition="all 0.2s"
                                        >
                                            Assumir
                                        </Button>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};