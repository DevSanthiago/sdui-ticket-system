import {
    Box, Flex, Heading, Text, VStack, HStack, Checkbox, Badge, Center, Icon
} from '@chakra-ui/react';
import { ListChecks, AlertCircle } from 'lucide-react';

import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useSummaryBuilder } from '../../../hooks/admin/useSummaryBuilder';

import { TicketCard } from '../../tickets/TicketCard';
import { StaticFileText } from '../../icons/StaticIcons';

import type { SummaryBuilderStepProps } from '../../../types';

export const SummaryBuilderStep = ({ fields, summaryFields, onChange, departmentConfig }: SummaryBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const {
        eligibleFields,
        previewTicket,
        isMaxLimitReached,
        handleToggleField,
        currentSelectionCount,
        maxSelectionLimit
    } = useSummaryBuilder({ fields, summaryFields, onChange, departmentConfig });

    return (
        <Box mb={16} w="100%">
            <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: "auto", lg: "500px" }} w="100%">

                <Flex flex={1} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%">
                    <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <Box color={theme.iconColor} display="flex">
                            <ListChecks size={20} />
                        </Box>
                        <Heading size="sm" color={theme.textPrimary}>Mapeamento de Resumo</Heading>
                    </HStack>

                    <Box mb={4}>
                        <Text fontSize="sm" color={theme.textSecondary} mb={2}>
                            Dentre todos os campos deste formulário, quais são os {maxSelectionLimit} mais importantes que o técnico precisa ler no card antes de tomar uma ação no ticket?
                            <br />
                            Selecione até {maxSelectionLimit} campos do seu formulário para aparecerem em destaque nos cards do Painel de Tickets.
                        </Text>
                        <HStack>
                            <Badge colorScheme={isMaxLimitReached ? "green" : "blue"} borderRadius="full" px={2}>
                                {currentSelectionCount} de {maxSelectionLimit} selecionados
                            </Badge>
                            {isMaxLimitReached && (
                                <Text fontSize="xs" color="green.500" fontWeight="bold">Limite atingido</Text>
                            )}
                        </HStack>
                    </Box>

                    <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }} pr={2}>
                        {eligibleFields.length === 0 ? (
                            <Center h="100%" flexDirection="column" gap={3} opacity={0.5}>
                                <Icon as={AlertCircle} size={32} color={theme.textSecondary} />
                                <Text fontSize="sm" color={theme.textSecondary} textAlign="center">
                                    Adicione perguntas no Passo 2 para poder mapeá-las aqui.
                                </Text>
                            </Center>
                        ) : (
                            <VStack align="stretch" spacing={3}>
                                {eligibleFields.map(field => {
                                    const isSelected = summaryFields.includes(field.id);
                                    const isDisabled = !isSelected && isMaxLimitReached;

                                    return (
                                        <Box
                                            key={field.id}
                                            p={3}
                                            bg={isSelected ? (isDarkMode ? 'blue.900' : 'blue.50') : theme.buttonBg}
                                            borderWidth="1px"
                                            borderColor={isSelected ? 'blue.500' : theme.cardBorder}
                                            borderRadius="lg"
                                            cursor={isDisabled ? 'not-allowed' : 'pointer'}
                                            onClick={() => !isDisabled && handleToggleField(field.id)}
                                            transition="all 0.2s"
                                            opacity={isDisabled ? 0.5 : 1}
                                            _hover={!isDisabled ? { borderColor: 'blue.500' } : {}}
                                        >
                                            <Checkbox
                                                isChecked={isSelected}
                                                isDisabled={isDisabled}
                                                colorScheme="blue"
                                                pointerEvents="none"
                                            >
                                                <VStack align="start" spacing={0} ml={2}>
                                                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                                                        {field.label}
                                                    </Text>
                                                    <Text fontSize="xs" color={theme.textSecondary}>
                                                        Tipo: {field.type}
                                                    </Text>
                                                </VStack>
                                            </Checkbox>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        )}
                    </Box>
                </Flex>

                <Flex flex={1} bg={theme.bgApp} p={5} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
                    <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <Box color={theme.iconColor} display="flex">
                            <StaticFileText size={20} />
                        </Box>
                        <Heading size="sm" color={theme.textPrimary}>Live Constructor</Heading>
                    </HStack>

                    <Center flex={1} w="100%">
                        <Box w="100%" maxW="380px" pointerEvents="none">
                            <TicketCard ticket={previewTicket} />
                        </Box>
                    </Center>
                </Flex>

            </Flex>
        </Box>
    );
};