import React, { useRef } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalBody,
    Text, VStack, HStack, Box, Center, useColorModeValue
} from '@chakra-ui/react';
import { ReceiptText, MessagesSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mosaic } from 'react-loading-indicators';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useETicketGenerator } from '../../hooks/tickets/useETicketGenerator';
import { useTicketSuccessModal } from '../../hooks/tickets/useTicketSuccessModal';
import { ETicketTemplate } from './ETicketTemplate';
import { LOADING_MESSAGES } from '../../constants/tickets/ticketSuccessConstants';
import type { TicketSuccessModalProps } from '../../types';

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
    isOpen, onClose, ticketData, actionType = 'create'
}) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const printRef = useRef<HTMLDivElement>(null);

    const { imagePreview, isGenerating } = useETicketGenerator({
        isOpen, ticketData, printRef, isDarkMode
    });

    const { msgIndex, getModalHeading } = useTicketSuccessModal({
        isGenerating, ticketData, actionType
    });

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
                <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(12px)" />
                <ModalContent bg={theme.bgApp} border="1px solid"
                    borderColor={theme.cardBorder} borderRadius="2xl">
                    <ModalBody p={6}>
                        <VStack spacing={5}>
                            <Box color="#48BB78">
                                <ReceiptText size={48} strokeWidth={1.5} />
                            </Box>

                            <VStack spacing={2} textAlign="center" px={2}>
                                <Text fontSize="xl" fontWeight="black" color={theme.textPrimary}>
                                    {getModalHeading()}
                                </Text>
                                <Text fontSize="sm" color={theme.textSecondary}>
                                    {isGenerating && actionType === 'create'
                                        ? "Processando a sua solicitação..."
                                        : actionType === 'create'
                                            ? "E-Ticket gerado com sucesso!"
                                            : "O status do rastreamento foi atualizado."}
                                </Text>
                            </VStack>

                            <Box w="full" borderRadius="lg" overflow="hidden" borderWidth="1px"
                                borderColor={theme.cardBorder}
                                bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}
                                position="relative" minH="220px">
                                {isGenerating ? (
                                    <Center position="absolute" inset={0}>
                                        <VStack spacing={6} w="full">
                                            <Mosaic color="#48BB78" size="medium" text="" textColor="" />
                                            <Box h="20px" position="relative" w="full" overflow="hidden">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={msgIndex}
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -15 }}
                                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                                        style={{ position: 'absolute', width: '100%', textAlign: 'center' }}
                                                    >
                                                        <Text fontSize="xs" color={theme.textSecondary}
                                                            px={4} fontWeight="medium">
                                                            {LOADING_MESSAGES[msgIndex]}
                                                        </Text>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Box>
                                        </VStack>
                                    </Center>
                                ) : (
                                    imagePreview && (
                                        <Box as="img" src={imagePreview} alt="E-Ticket" w="full" h="auto" />
                                    )
                                )}
                            </Box>

                            {!isGenerating && actionType === 'create' && (
                                <HStack
                                    w="full" spacing={3} align="flex-start"
                                    bg={isDarkMode ? "whiteAlpha.100" : "blackAlpha.50"}
                                    border="1px solid" borderColor={theme.cardBorder}
                                    borderRadius="xl" p={4}
                                >
                                    <Box color="#48BB78" pt="2px">
                                        <MessagesSquare size={20} />
                                    </Box>
                                    <Text fontSize="xs" color={theme.textSecondary} lineHeight="1.5">
                                        O Ticket System gerou o E-Ticket e o enviou automaticamente para o
                                        canal de chamados no Google Chat. Não é necessário encaminhar manualmente.
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <ETicketTemplate
                ticketData={ticketData}
                isDarkMode={isDarkMode}
                printRef={printRef}
            />
        </>
    );
};