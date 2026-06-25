import React, { useRef } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalBody, Button,
    Text, VStack, Box, Icon, Center, useColorModeValue
} from '@chakra-ui/react';
import { ReceiptText, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mosaic } from 'react-loading-indicators';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useETicketGenerator } from '../../hooks/tickets/useETicketGenerator';
import { useTicketSuccessModal } from '../../hooks/tickets/useTicketSuccessModal';
import { ETicketTemplate } from './ETicketTemplate';
import { LOADING_MESSAGES, WHATSAPP_GREEN } from '../../constants/tickets/ticketSuccessConstants';
import type { TicketSuccessModalProps } from '../../types';

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
    isOpen, onClose, ticketData, actionType = 'create'
}) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const printRef = useRef<HTMLDivElement>(null);

    const { imagePreview, isGenerating, isCopying, copyImageToClipboard } = useETicketGenerator({
        isOpen, ticketData, printRef, isDarkMode, onClose
    });

    const { msgIndex, getModalHeading } = useTicketSuccessModal({
        isGenerating, ticketData, actionType
    });

    const neonShadow = `0 0 15px ${WHATSAPP_GREEN}, 0 0 30px ${WHATSAPP_GREEN}`;

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
                                            ? "E-Ticket gerado com sucesso! Copie ele no botão abaixo e compartilhe no grupo de chamados do setor correto!"
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

                            <Button
                                w="full" bg={WHATSAPP_GREEN} color="white"
                                leftIcon={<Icon as={MessageCircle} fill="white" />}
                                isDisabled={isGenerating} isLoading={isCopying}
                                onClick={copyImageToClipboard}
                                borderRadius="xl" size="lg" fontWeight="black"
                                transition="all 0.3s ease"
                                _hover={isDarkMode
                                    ? {
                                        bg: WHATSAPP_GREEN,
                                        boxShadow: neonShadow,
                                        _before: {
                                            content: '""', position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            borderRadius: 'xl',
                                            boxShadow: `inset 0 0 10px white`,
                                            opacity: 0.5
                                        }
                                    }
                                    : { bg: "#048b35" }
                                }
                                sx={isDarkMode
                                    ? { "&:hover span, &:hover svg": { filter: `drop-shadow(0 0 5px white)` } }
                                    : {}
                                }
                            >
                                Copiar para o WhatsApp
                            </Button>
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