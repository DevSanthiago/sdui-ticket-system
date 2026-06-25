import {
    Box, Flex, Text, VStack, HStack, Center, SimpleGrid
} from '@chakra-ui/react';
import { Vote, BadgeCheck, Goal } from 'lucide-react';
import { TicketStatus, type ETicketTemplateProps, type DynamicField } from '../../types';

export const ETicketTemplate = ({ ticketData, isDarkMode, printRef }: ETicketTemplateProps) => {
    return (
        <Box position="absolute" top="0" left="-9999px" zIndex="-9999" pointerEvents="none">
            <Box
                ref={printRef}
                w="550px" p={6}
                bg={isDarkMode ? "#121212" : "#FFFFFF"}
                color={isDarkMode ? "#FFFFFF" : "#1A202C"}
                fontFamily="sans-serif"
            >
                <Flex
                    justify="space-between" align="center"
                    borderBottom="2px dashed"
                    borderColor={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
                    pb={4} mb={4}
                >
                    <VStack align="start" spacing={0}>
                        <Text fontSize="10px" fontWeight="bold" color="gray.500" letterSpacing="widest">
                            TICKET SYSTEM — COMPROVANTE ELETRÔNICO
                        </Text>
                        <Text fontSize="xl" fontWeight="black">
                            #{ticketData?.id} — {ticketData?.lineName}
                        </Text>
                    </VStack>
                    <Text
                        fontSize="10px" fontWeight="black" letterSpacing="widest"
                        textTransform="uppercase"
                        color={ticketData?.isLineStopped ? "red.500" : "green.500"}
                    >
                        {ticketData?.isLineStopped ? "LINHA PARADA" : "E-TICKET GERADO"}
                    </Text>
                </Flex>

                <SimpleGrid columns={2} spacing={4} mb={6}>
                    <Box>
                        <Text color="gray.500" fontSize="10px" fontWeight="bold" letterSpacing="wide">
                            SOLICITANTE
                        </Text>
                        <Text fontWeight="bold" fontSize="sm">{ticketData?.openedBy}</Text>
                    </Box>
                    <Box>
                        <Text color="gray.500" fontSize="10px" fontWeight="bold" letterSpacing="wide">
                            DATA / HORA EMISSÃO
                        </Text>
                        <Text fontWeight="bold" fontSize="sm">{ticketData?.openedAt}</Text>
                    </Box>
                </SimpleGrid>

                {ticketData?.dynamicFields && ticketData.dynamicFields.length > 0 && (
                    <>
                        <Text fontSize="10px" fontWeight="bold" color="gray.500"
                            textTransform="uppercase" mb={3} letterSpacing="wider">
                            INFORMAÇÕES DA SOLICITAÇÃO
                        </Text>
                        <SimpleGrid columns={2} spacing={4} mb={6}>
                            {ticketData.dynamicFields.map((field: DynamicField, idx: number) => {
                                const isLastOddItem = idx === ticketData.dynamicFields.length - 1
                                    && ticketData.dynamicFields.length % 2 !== 0;
                                return (
                                    <Box
                                        key={idx}
                                        gridColumn={isLastOddItem ? "span 2" : "span 1"}
                                        bg={isDarkMode ? "whiteAlpha.100" : "blackAlpha.50"}
                                        p={3} borderRadius="lg"
                                    >
                                        <Text fontSize="8px" fontWeight="bold" color="gray.500"
                                            textTransform="uppercase" mb={1}>
                                            {field.label}
                                        </Text>
                                        <Text fontSize="xs" fontWeight="bold">{field.value}</Text>
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    </>
                )}

                <Text fontSize="10px" fontWeight="bold" color="gray.500"
                    textTransform="uppercase" mb={4} letterSpacing="wider">
                    STATUS DE RASTREAMENTO
                </Text>
                <VStack align="stretch" spacing={5} position="relative" pl={2}>
                    <HStack spacing={4} align="center">
                        <Center boxSize="28px" borderRadius="full" bg="green.500" color="white">
                            <Vote size={14} />
                        </Center>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold">Ticket aberto no painel industrial</Text>
                            <Text fontSize="10px" color="gray.500">{ticketData?.openedAt}</Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={4} align="center">
                        <Center boxSize="28px" borderRadius="full" color="white"
                            bg={(ticketData?.status === TicketStatus.InProgress || ticketData?.status === TicketStatus.Resolved)
                                ? "green.500" : "gray.600"}>
                            <BadgeCheck size={14} />
                        </Center>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold"
                                color={(ticketData?.status === TicketStatus.InProgress || ticketData?.status === TicketStatus.Resolved)
                                    ? "inherit" : "gray.500"}>
                                {(ticketData?.status === TicketStatus.InProgress || ticketData?.status === TicketStatus.Resolved)
                                    ? `Técnico: ${ticketData.startedBy || '...'}`
                                    : "Aguardando engenheiro assumir..."}
                            </Text>
                            <Text fontSize="10px" color="gray.500">
                                {ticketData?.startedAt || "--:--"}
                            </Text>
                        </VStack>
                    </HStack>

                    <HStack spacing={4} align="center">
                        <Center boxSize="28px" borderRadius="full" color="white"
                            bg={ticketData?.status === TicketStatus.Resolved ? "green.500" : "gray.600"}>
                            <Goal size={14} />
                        </Center>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="xs" fontWeight="bold"
                                color={ticketData?.status === TicketStatus.Resolved ? "inherit" : "gray.500"}>
                                {ticketData?.status === TicketStatus.Resolved
                                    ? "Atendimento finalizado"
                                    : "Aguardando conclusão física na linha"}
                            </Text>
                            <Text fontSize="10px" color="gray.500">
                                {ticketData?.finishedAt || "--:--"}
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>

                <Box mt={6} pt={4} borderTop="1px solid"
                    borderColor={isDarkMode ? "whiteAlpha.200" : "blackAlpha.100"}
                    textAlign="center">
                    <Text fontSize="9px" color="gray.500" lineHeight="1.4" letterSpacing="wide">
                        &copy; 2026 Ticket System. Todos os direitos reservados.
                        <br />
                        Desenvolvido por Dev Santhiago. v: {__APP_VERSION__}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};