import { Box, Flex, Text, Badge, Button, HStack, VStack, Icon, Divider } from '@chakra-ui/react';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useTicketCard } from '../../hooks/tickets/useTicketCard';
import type { MockTicket } from '../../types';

interface TicketCardProps {
    ticket: MockTicket;
    onClick?: () => void;
}

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
    const { theme, isDarkMode, statusLabel, statusColor } = useTicketCard(ticket.status);

    return (
        <Box
            role="group"
            bg={theme.cardBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={theme.cardBorder}
            borderLeftWidth="4px"
            borderLeftColor={ticket.departmentColor}
            p={5}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            cursor="pointer"
            onClick={onClick}
            _hover={{
                shadow: 'lg',
                transform: 'translateY(-2px)',
                borderColor: isDarkMode ? 'whiteAlpha.400' : 'gray.300'
            }}
            position="relative"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            h="100%"
        >
            {/* Header do Card */}
            <Flex justify="space-between" align="flex-start" mb={4}>
                <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                        <Text fontSize="sm" fontWeight="bold" color={theme.textSecondary}>
                            #{ticket.id}
                        </Text>
                        <Text color={theme.textSecondary}>•</Text>
                        <Text fontSize="md" fontWeight="bold" color={theme.textPrimary} noOfLines={1}>
                            {ticket.lineName}
                        </Text>
                    </HStack>
                    <HStack spacing={1} color={theme.textSecondary} fontSize="xs">
                        <Icon as={Clock} size={12} />
                        <Text>Aberto {ticket.openedAt}</Text>
                    </HStack>
                </VStack>

                {ticket.isLineStopped && (
                    <Badge colorScheme="red" variant="subtle" px={2} py={1} borderRadius="md" display="flex" alignItems="center" gap={1}>
                        <Icon as={AlertTriangle} size={12} />
                        <Text fontSize="2xs" fontWeight="bold">LINHA PARADA</Text>
                    </Badge>
                )}
            </Flex>

            <VStack align="stretch" spacing={2} mb={5} flex={1}>
                {ticket.dynamicFields.map((field, idx) => (
                    <Box key={idx} bg={isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50'} p={2} borderRadius="md">
                        <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} textTransform="uppercase" mb={0.5}>
                            {field.label}
                        </Text>
                        <Text fontSize="sm" color={theme.textPrimary} fontWeight="medium" noOfLines={2}>
                            {field.value}
                        </Text>
                    </Box>
                ))}
            </VStack>

            <Divider borderColor={theme.cardBorder} mb={4} />

            <Flex justify="space-between" align="center" mt="auto">
                <HStack spacing={2}>
                    <Box w="8px" h="8px" borderRadius="full" bg={`${statusColor}.500`} />
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                        {statusLabel}
                    </Text>
                </HStack>

                <Button
                    size="sm"
                    bg={theme.buttonBg}
                    color={theme.textPrimary}
                    borderColor={theme.cardBorder}
                    borderWidth="1px"
                    borderRadius="lg"
                    rightIcon={<Icon as={ArrowRight} size={14} />}
                    transition="all 0.2s"
                    _groupHover={{
                        bg: isDarkMode ? 'white' : 'black',
                        color: isDarkMode ? 'black' : 'white'
                    }}
                >
                    Assumir
                </Button>
            </Flex>
        </Box>
    );
};