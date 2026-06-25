import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Flex, Text, HStack, VStack, SimpleGrid, Modal, ModalOverlay, Button,
    ModalContent, ModalHeader, ModalBody, ModalCloseButton, Badge, Icon, Grid, GridItem, Circle
} from '@chakra-ui/react';
import { Clock, User as UserIcon, ChevronRight, Check, Vote, BadgeCheck, Goal, CircleDashed, MessageSquareText } from 'lucide-react';
import { useTicketDetails } from '../../hooks/tickets/useTicketDetails';
import { TicketStatus, type TicketDetailsModalProps, type TimelineStepProps } from '../../types';

const TimelineStep: React.FC<TimelineStepProps> = ({ isActive, isCompleted, isLast, icon, title, description, time, theme, isDarkMode }) => {
    const activeColor = "green.400";
    const mutedColor = isDarkMode ? "whiteAlpha.400" : "blackAlpha.400";
    const iconBg = isCompleted || isActive ? (isDarkMode ? "whiteAlpha.200" : "blackAlpha.50") : "transparent";
    const iconColor = isCompleted ? activeColor : isActive ? "blue.400" : mutedColor;
    const glowRgb = isCompleted ? "72, 187, 120" : "66, 153, 225";

    return (
        <HStack spacing={4} align="flex-start" position="relative" flex={1} w="full">
            {!isLast && (
                <Box position="absolute" left="15px" top="36px" bottom="-4px" w="2px" bg={isCompleted ? activeColor : (isDarkMode ? "whiteAlpha.200" : "blackAlpha.100")} zIndex={0} />
            )}
            <Box position="relative" zIndex={1} bg={theme.bgApp} py={1}>
                {isActive ? (
                    <motion.div
                        animate={{
                            boxShadow: [
                                `0 0 4px rgba(${glowRgb}, 0.3), 0 0 2px rgba(${glowRgb}, 0.2)`,
                                `0 0 24px rgba(${glowRgb}, 0.9), 0 0 12px rgba(${glowRgb}, 0.6)`,
                                `0 0 4px rgba(${glowRgb}, 0.3), 0 0 2px rgba(${glowRgb}, 0.2)`
                            ]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ borderRadius: '50%' }}
                    >
                        <Circle size="32px" bg={iconBg} color={iconColor} borderWidth="2px" borderColor={iconColor}>{icon}</Circle>
                    </motion.div>
                ) : (
                    <Circle size="32px" bg={iconBg} color={iconColor} borderWidth="1px" borderColor={isCompleted ? activeColor : mutedColor}>{icon}</Circle>
                )}
            </Box>
            <VStack align="start" spacing={0} flex={1} pt={1} pb={isLast ? 0 : 4} opacity={isCompleted || isActive ? 1 : 0.5}>
                <Flex w="full" justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>{title}</Text>
                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}>{time}</Text>
                </Flex>
                <Text fontSize="xs" color={theme.textSecondary} mt={1}>{description}</Text>
            </VStack>
        </HStack>
    );
};

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
    isOpen, onClose, selectedTicket, actionLoadingId, handleTicketAction, animatingBite, animatingTear, onOpenFeedback, canManageTickets = false
}) => {
    const {
        theme, isDarkMode, hasBite, topMaskCss, bottomMaskCss,
        formattedDynamicFields, handleFeedbackClick
    } = useTicketDetails(selectedTicket, animatingBite, onClose, onOpenFeedback);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered motionPreset="slideInBottom">
            <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
            <ModalContent
                bg="transparent" border="none" boxShadow="none" overflow="visible" position="relative"
                filter={isDarkMode ? 'drop-shadow(0 0 1px rgba(255,255,255,0.2)) drop-shadow(0 15px 30px rgba(0,0,0,0.9))' : 'drop-shadow(0 0 1px rgba(0,0,0,0.1)) drop-shadow(0 10px 20px rgba(0,0,0,0.15))'}
            >
                <Box bg={theme.bgApp} borderTopRadius="3xl" borderBottomRadius="0" position="relative" zIndex={2} css={topMaskCss} transition="mask-image 0.2s ease">
                    <ModalHeader py={6} bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"} borderTopRadius="3xl">
                        <Flex justify="space-between" align="center" pr={8}>
                            <HStack spacing={4}>
                                <Box w="14px" h="14px" borderRadius="full" bg={selectedTicket?.departmentColor} shadow={`0 0 12px ${selectedTicket?.departmentColor}`} />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="2xs" color={theme.textSecondary} fontWeight="bold" textTransform="uppercase" letterSpacing="widest">Detalhes do Ticket</Text>
                                    <Text fontSize="2xl" fontWeight="black" letterSpacing="tight">#{selectedTicket?.id} — {selectedTicket?.lineName}</Text>
                                </VStack>
                            </HStack>
                            {selectedTicket?.isLineStopped && (
                                <motion.div
                                    animate={{ boxShadow: ["0 0 4px rgba(229, 62, 62, 0.3), 0 0 2px rgba(229, 62, 62, 0.2)", "0 0 24px rgba(229, 62, 62, 0.9), 0 0 12px rgba(229, 62, 62, 0.6)", "0 0 4px rgba(229, 62, 62, 0.3), 0 0 2px rgba(229, 62, 62, 0.2)"] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ borderRadius: '9999px' }}
                                >
                                    <Badge bg="red.600" color="white" fontSize="xs" px={4} py={1.5} borderRadius="full" border="1px solid" borderColor="red.400" letterSpacing="widest">
                                        LINHA PARADA
                                    </Badge>
                                </motion.div>
                            )}
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton mt={3} />

                    <ModalBody p={8}>
                        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                            <Box flex="3" pr={{ lg: 6 }} borderRightWidth={{ base: 0, lg: "1px" }} borderColor={theme.cardBorder}>
                                <SimpleGrid columns={2} spacing={8} mb={8}>
                                    <VStack align="start" spacing={1}>
                                        <HStack color={theme.textSecondary} fontSize="xs" fontWeight="bold" textTransform="uppercase"><Icon as={UserIcon} size={14} /><Text>Solicitante</Text></HStack>
                                        <Text fontWeight="bold" fontSize="md">{selectedTicket?.openedBy}</Text>
                                    </VStack>
                                    <VStack align="start" spacing={1}>
                                        <HStack color={theme.textSecondary} fontSize="xs" fontWeight="bold" textTransform="uppercase"><Icon as={Clock} size={14} /><Text>Data / Hora</Text></HStack>
                                        <Text fontWeight="bold" fontSize="md">{selectedTicket?.openedAt}</Text>
                                    </VStack>
                                </SimpleGrid>

                                <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} textTransform="uppercase" mb={4} letterSpacing="wider">Informações da Solicitação</Text>

                                <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5} pb={2}>
                                    {formattedDynamicFields.map((field, idx) => (
                                        <GridItem key={idx} colSpan={{ base: 1, lg: field.colSpan }}>
                                            <Box h="full" bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"} p={4} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} display="flex" flexDirection="column">
                                                <Text fontSize="2xs" fontWeight="bold" color={theme.textSecondary} textTransform="uppercase" mb={1}>{field.label}</Text>
                                                <Text fontSize="sm" fontWeight="medium">{field.value}</Text>
                                            </Box>
                                        </GridItem>
                                    ))}
                                </Grid>
                            </Box>

                            <Flex flex="2" pl={{ lg: 2 }} direction="column">
                                <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} textTransform="uppercase" mb={6} letterSpacing="wider">
                                    Acompanhamento em Tempo Real
                                </Text>
                                <Flex direction="column" flex="1" w="full" h="full">
                                    <TimelineStep
                                        theme={theme} isDarkMode={isDarkMode}
                                        isActive={selectedTicket?.status === TicketStatus.Open}
                                        isCompleted={true}
                                        icon={<Vote size={14} />}
                                        title={`${selectedTicket?.openedBy || 'Operador'} abriu o ticket`}
                                        time={selectedTicket?.openedAt || '--:--'}
                                        description="Solicitação recebida e registrada no painel da engenharia."
                                    />
                                    <TimelineStep
                                        theme={theme} isDarkMode={isDarkMode}
                                        isActive={selectedTicket?.status === TicketStatus.InProgress}
                                        isCompleted={selectedTicket?.status === TicketStatus.Resolved || selectedTicket?.status === TicketStatus.InProgress}
                                        icon={selectedTicket?.status === TicketStatus.Open ? <CircleDashed size={14} /> : <BadgeCheck size={14} />}
                                        title={selectedTicket?.status === TicketStatus.Open ? "Aguardando um técnico assumir" : `O ${selectedTicket?.startedByRole || 'Técnico'} ${selectedTicket?.startedBy || ''} assumiu o ticket`}
                                        time={selectedTicket?.startedAt || '--:--'}
                                        description={selectedTicket?.status === TicketStatus.Open ? "Buscando o próximo engenheiro disponível..." : "O técnico visualizou seu problema e está a caminho da linha."}
                                    />
                                    <TimelineStep
                                        theme={theme} isDarkMode={isDarkMode}
                                        isActive={selectedTicket?.status === TicketStatus.Resolved}
                                        isCompleted={selectedTicket?.status === TicketStatus.Resolved}
                                        isLast={true}
                                        icon={selectedTicket?.status === TicketStatus.Resolved ? <Goal size={14} /> : <CircleDashed size={14} />}
                                        title={selectedTicket?.status === TicketStatus.Resolved ? `O ${selectedTicket?.finishedByRole || 'Técnico'} ${selectedTicket?.finishedBy || ''} finalizou o atendimento` : "Aguardando conclusão"}
                                        time={selectedTicket?.finishedAt || '--:--'}
                                        description={selectedTicket?.status === TicketStatus.Resolved ? "Manutenção concluída com sucesso e equipamento liberado." : "O ticket ainda está sendo tratado pelo técnico."}
                                    />
                                </Flex>
                            </Flex>
                        </Flex>
                    </ModalBody>

                    <Box position="absolute" bottom="0" left="25px" right="25px" borderBottom="2px dashed" borderColor={isDarkMode ? 'whiteAlpha.300' : 'blackAlpha.300'} opacity={hasBite ? 1 : 0} transition="opacity 0.2s ease" zIndex={5} />

                    <Box position="relative" w="full" h="0" zIndex={30}>
                        <AnimatePresence>
                            {animatingBite && (
                                <>
                                    <motion.div initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }} animate={{ x: -80, y: 120, opacity: 0, scale: 0.6, rotate: -250 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ position: 'absolute', top: '-20px', left: '-20px', width: '40px', height: '40px', backgroundColor: theme.bgApp, borderRadius: '50%' }} />
                                    <motion.div initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }} animate={{ x: 80, y: 120, opacity: 0, scale: 0.6, rotate: 250 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ position: 'absolute', top: '-20px', right: '-20px', width: '40px', height: '40px', backgroundColor: theme.bgApp, borderRadius: '50%' }} />
                                </>
                            )}
                        </AnimatePresence>
                    </Box>
                </Box>

                <AnimatePresence>
                    {canManageTickets && (selectedTicket?.status !== TicketStatus.Resolved || animatingTear) && (
                        <motion.div initial={false} animate={animatingTear ? { y: 600, rotate: -15, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }} transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }} style={{ transformOrigin: 'top left', zIndex: 1, marginTop: '-1px' }}>
                            <Box bg={theme.bgApp} borderTopRadius="0" borderBottomRadius="3xl" position="relative" css={bottomMaskCss} transition="mask-image 0.2s ease">
                                <Box as="button" w="full" h="80px" display="flex" alignItems="center" justifyContent="center" borderBottomRadius="3xl" bg={isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50'} _hover={{ bg: isDarkMode ? 'whiteAlpha.200' : 'blackAlpha.200' }} onClick={(e: React.MouseEvent) => selectedTicket && handleTicketAction(selectedTicket, e)} disabled={actionLoadingId === selectedTicket?.id} transition="all 0.3s ease">
                                    <HStack spacing={3}>
                                        <Text fontSize="lg" fontWeight="black" textTransform="uppercase" letterSpacing="widest" color={selectedTicket?.status !== TicketStatus.Open ? 'green.400' : theme.textPrimary}>
                                            {selectedTicket?.status === TicketStatus.Open ? 'Assumir Ticket' : 'Finalizar Ticket'}
                                        </Text>
                                        {selectedTicket?.status === TicketStatus.Open ? <ChevronRight size={20} color={theme.textPrimary} /> : <Check size={20} color="var(--chakra-colors-green-400)" />}
                                    </HStack>
                                </Box>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!canManageTickets && selectedTicket?.status !== TicketStatus.Resolved && (
                    <Box bg={theme.bgApp} borderBottomRadius="3xl" position="relative">
                        <Flex w="full" minH="64px" align="center" justify="center" px={8} py={4} bg={isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50'} borderBottomRadius="3xl">
                            <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color={theme.textSecondary}>
                                Visualização — somente leitura
                            </Text>
                        </Flex>
                    </Box>
                )}

                {selectedTicket?.status === TicketStatus.Resolved && !animatingTear && (
                    <Box bg={theme.bgApp} borderTopRadius="0" borderBottomRadius="3xl" position="relative" css={bottomMaskCss} overflow="hidden">
                        <Flex w="full" minH="80px" align="center" justify="space-between" px={8} py={4} bg={isDarkMode ? 'whiteAlpha.50' : 'blackAlpha.50'}>
                            <VStack align="start" spacing={0} maxW="60%">
                                <Text fontSize="md" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color={theme.textSecondary}>Ticket Concluído</Text>
                                {selectedTicket.resolutionFeedback && (
                                    <Text fontSize="xs" color={theme.textSecondary} noOfLines={2}>Feedback: {selectedTicket.resolutionFeedback}</Text>
                                )}
                            </VStack>
                            <Button
                                size="sm" leftIcon={<Icon as={MessageSquareText} size={16} />}
                                bg={selectedTicket.canAddFeedback ? (isDarkMode ? "white" : "black") : "transparent"}
                                color={selectedTicket.canAddFeedback ? (isDarkMode ? "black" : "white") : theme.textSecondary}
                                border={selectedTicket.canAddFeedback ? "none" : "1px solid"}
                                borderColor={theme.cardBorder} opacity={selectedTicket.canAddFeedback ? 1 : 0.6}
                                _hover={selectedTicket.canAddFeedback ? { bg: isDarkMode ? "gray.200" : "gray.800" } : {}}
                                onClick={handleFeedbackClick}
                            >
                                {selectedTicket.resolutionFeedback ? "Editar Observação" : "Adicionar Feedback"}
                            </Button>
                        </Flex>
                    </Box>
                )}
            </ModalContent>
        </Modal>
    );
};