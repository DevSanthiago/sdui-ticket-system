import { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, VStack, Button, Text, Center, Spinner, Flex, HStack, IconButton } from '@chakra-ui/react';
import { api } from '../../services/api/api';
import { Alert } from '../../services/alerts/alertService';
import { DynamicFormRenderer } from '../../components/dynamic-form/DynamicFormRenderer';
import { computeProgressiveFields } from '../../helpers/formHelpers';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import type { Department, DynamicFieldValue } from '../../types';
import { TicketSuccessModal } from '../../components/tickets/TicketSuccessModal';
import { useTicketSubmission } from '../../hooks/tickets/useTicketSubmission';

export const DynamicTicketForm = () => {
    const { departmentId } = useParams();
    const navigate = useNavigate();
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const [department, setDepartment] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, DynamicFieldValue>>({});

    const [isSendHovered, setIsSendHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isHeaderIconHovered, setIsHeaderIconHovered] = useState(false);

    const {
        submitTicket,
        isSubmitting,
        createdTicketData,
        isSuccessOpen,
        onCloseSuccess
    } = useTicketSubmission(departmentId, department);

    useEffect(() => {
        const fetchDepartmentSchema = async () => {
            try {
                const response = await api.get(`/actions-panel/${departmentId}`);
                setDepartment(response.data);
            } catch {
                Alert.error('Erro', 'Formulário não encontrado.');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        if (departmentId) fetchDepartmentSchema();
    }, [departmentId, navigate]);

    const handleAnswerChange = useCallback((fieldId: string, value: DynamicFieldValue) => {
        setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    }, []);

    const handleConfirmClick = async () => {
        if (!department) return;

        const { visibleFields } = computeProgressiveFields(department.formSchema.fields, answers, true);
        const requiredFields = visibleFields.filter(f => f.required);

        const missingFields = requiredFields.filter(f => {
            if (f.type === 'line_stop') {
                return answers[`${f.id}_status`] === undefined || answers[`${f.id}_status`] === null;
            }
            return !answers[f.id] || String(answers[f.id]).trim() === '';
        });

        if (missingFields.length > 0) {
            return Alert.warning('Atenção', `Por favor, preencha o campo: ${missingFields[0].label}`);
        }

        const lineFieldVisible = visibleFields.some(f => f.type === 'dynamic_location');
        const productionLineId = lineFieldVisible ? Number(answers['informacoes_linha']) : null;
        const isLineStopped = lineFieldVisible && answers['status_parada_linha_status'] === true;
        const lineStoppedTime = isLineStopped ? answers['status_parada_linha_time'] as string : null;

        if (lineFieldVisible && !productionLineId) {
            return Alert.warning('Atenção', 'Selecione uma Linha de Produção para continuar.');
        }

        let resolvedLineName = productionLineId ? `Linha ${productionLineId}` : '';
        if (productionLineId) {
            const lineField = department.formSchema.fields.find(f => f.id === 'informacoes_linha');
            const selectedOption = lineField?.options?.find(opt => String(opt.value) === String(productionLineId));
            if (selectedOption) {
                resolvedLineName = selectedOption.label;
            }
        }

        const success = await submitTicket(answers, productionLineId, resolvedLineName, isLineStopped, lineStoppedTime);

        if (success) {
            setAnswers({});
        }
    };

    const { visibleFields, isComplete } = useMemo(
        () => computeProgressiveFields(department?.formSchema.fields ?? [], answers, true),
        [department?.formSchema.fields, answers]
    );

    if (isLoading) {
        return (
            <Center h="calc(100vh - 100px)">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!department) return null;

    const iconKey = (department.iconName || 'AnimatedBox') as keyof typeof AnimatedIcons;
    const DynamicHeaderIcon = AnimatedIcons[iconKey] || AnimatedIcons.AnimatedBox;

    return (
        <Flex direction="column" w="100%" h="100%" p={{ base: 4, md: 8 }} overflow="hidden">
            <Flex flex={1} direction="column" w="100%" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' } }}>
                <Box w="100%" maxW="700px" mx="auto" pb={10} px={2}>
                    <Box mb={6} flexShrink={0}>
                        <Flex justify="space-between" align="center" mb={2} flexWrap="wrap" gap={4}>
                            <HStack spacing={4}>
                                <IconButton aria-label="Voltar" icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />} onClick={() => navigate('/')} variant="ghost" color={theme.textPrimary} _hover={{ bg: isDarkMode ? "whiteAlpha.200" : "blackAlpha.100" }} onMouseEnter={() => setIsBackHovered(true)} onMouseLeave={() => setIsBackHovered(false)} />
                                <Box color={theme.iconColor} display="flex" alignItems="center" justifyContent="center" onMouseEnter={() => setIsHeaderIconHovered(true)} onMouseLeave={() => setIsHeaderIconHovered(false)}>
                                    <DynamicHeaderIcon size={32} isHovered={isHeaderIconHovered} />
                                </Box>
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="xs" color={theme.textSecondary} fontWeight="bold" textTransform="uppercase" letterSpacing="wider">Abertura de Ticket</Text>
                                    <Heading size="lg" color={theme.textPrimary}>{department.name}</Heading>
                                </VStack>
                            </HStack>
                        </Flex>
                        {department.description && <Text color={theme.textSecondary} fontSize="md" ml={14}>{department.description}</Text>}
                    </Box>

                    <Box bg={theme.bgApp} p={{ base: 6, md: 8 }} borderRadius="xl" borderWidth="1px" borderColor={theme.cardBorder} shadow="sm">
                        <VStack spacing={8} align="stretch">
                            <DynamicFormRenderer fields={visibleFields} answers={answers} onAnswerChange={handleAnswerChange} />
                        </VStack>
                    </Box>

                    {isComplete && (
                        <Box flexShrink={0} mt={6}>
                            <Button w="100%" h="54px" size="lg" bg={isDarkMode ? "white" : "black"} color={isDarkMode ? "black" : "white"} _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }} rightIcon={<AnimatedIcons.AnimatedSend size={20} isHovered={isSendHovered} />} onClick={handleConfirmClick} isLoading={isSubmitting} onMouseEnter={() => setIsSendHovered(true)} onMouseLeave={() => setIsSendHovered(false)} fontSize="lg" fontWeight="bold" borderRadius="xl" shadow="md">
                                Confirmar e Abrir Ticket
                            </Button>
                        </Box>
                    )}
                </Box>
            </Flex>

            <TicketSuccessModal
                isOpen={isSuccessOpen}
                onClose={() => { onCloseSuccess(); navigate('/tickets/board', { state: { departmentId: departmentId ? Number(departmentId) : null } }); }}
                ticketData={createdTicketData}
                actionType="create"
            />
        </Flex>
    );
};