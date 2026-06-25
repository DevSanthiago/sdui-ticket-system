import React from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Textarea, Text, VStack, Box
} from '@chakra-ui/react';
import { useTicketFeedback } from '../../hooks/tickets/useTicketFeedback';
import * as AnimatedIcons from '../icons/NewAnimatedIcons';
import type { TicketFeedbackModalProps } from '../../types';

export const TicketFeedbackModal: React.FC<TicketFeedbackModalProps> = ({
    isOpen, onClose, ticketId, onSubmitFeedback
}) => {
    const {
        theme, isDarkMode, feedback, setFeedback, isSubmitting,
        isSendHovered, setIsSendHovered, isTopIconAnimating,
        activeColor, handleSubmit, handleSkip
    } = useTicketFeedback(isOpen, onClose, ticketId, onSubmitFeedback);

    return (
        <Modal isOpen={isOpen} onClose={handleSkip} size="lg" isCentered motionPreset="slideInBottom">
            <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(12px)" />

            <ModalContent bg={theme.bgApp} border="1px solid" borderColor={theme.cardBorder} borderRadius="2xl">
                <ModalHeader pt={8} pb={4}>
                    <VStack spacing={3}>
                        <Box color={theme.textPrimary}>
                            <AnimatedIcons.AnimatedFileText
                                size={36}
                                isHovered={isTopIconAnimating}
                            />
                        </Box>
                        <Text fontSize="xl" fontWeight="black" color={theme.textPrimary}>
                            Feedback do Atendimento
                        </Text>
                        <Text fontSize="sm" color={theme.textSecondary} fontWeight="normal" textAlign="center" px={4}>
                            Como foi a resolução do Ticket #{ticketId}? Deixe suas observações importantes sobre problemas no atendimento e como solucionou.
                        </Text>
                    </VStack>
                </ModalHeader>

                <ModalBody pb={6}>
                    <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Ex: Foi necessário calibrar a posição das câmeras..."
                        size="md"
                        borderRadius="xl"
                        minH="120px"
                        bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}
                        border="1px solid"
                        borderColor={theme.cardBorder}
                        color={theme.textPrimary}
                        _hover={{ borderColor: theme.textSecondary }}
                        _focus={{ borderColor: activeColor, boxShadow: `0 0 0 1px ${activeColor}` }}
                        resize="none"
                    />
                </ModalBody>

                <ModalFooter borderTop="1px solid" borderColor={theme.cardBorder} py={5} gap={3} flexDir={{ base: 'column', md: 'row' }}>
                    <Button
                        w={{ base: 'full', md: 'auto' }}
                        variant="ghost"
                        color={theme.textSecondary}
                        onClick={handleSkip}
                        isDisabled={isSubmitting}
                    >
                        Pular feedback
                    </Button>
                    <Button
                        w={{ base: 'full', md: 'auto' }}
                        flex={1}
                        h="54px"
                        size="lg"
                        bg={isDarkMode ? "white" : "black"}
                        color={isDarkMode ? "black" : "white"}
                        _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                        rightIcon={<AnimatedIcons.AnimatedSend size={20} isHovered={isSendHovered} />}
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        isDisabled={!feedback.trim()}
                        onMouseEnter={() => setIsSendHovered(true)}
                        onMouseLeave={() => setIsSendHovered(false)}
                        fontSize="lg"
                        fontWeight="bold"
                        borderRadius="xl"
                        shadow="md"
                    >
                        Salvar Observações
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};