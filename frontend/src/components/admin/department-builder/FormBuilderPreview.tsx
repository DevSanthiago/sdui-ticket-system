import { useMemo } from 'react';
import { Box, Flex, Heading, HStack, Button, Text } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { StaticFileText } from '../../icons/StaticIcons';
import { DynamicFormRenderer } from '../../dynamic-form/DynamicFormRenderer';
import { computeProgressiveFields } from '../../../helpers/formHelpers';
import { useFormBuilderPreview } from '../../../hooks/admin/useFormBuilderPreview';
import type { FormBuilderPreviewProps } from '../../../types';

export const FormBuilderPreview = ({ fields, departmentName }: FormBuilderPreviewProps) => {
    const theme = useMinimalTheme();
    const { previewAnswers, handlePreviewAnswerChange } = useFormBuilderPreview();
    const { visibleFields } = useMemo(
        () => computeProgressiveFields(fields, previewAnswers, false),
        [fields, previewAnswers]
    );

    return (
        <Flex flex={1} bg={theme.bgApp} borderRadius="xl" borderWidth="1px"
            borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
            <Box w="100%" pt={5} px={5} bg={theme.cardBg}>
                <HStack w="100%" pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex"><StaticFileText size={20} /></Box>
                    <Heading size="sm" color={theme.textPrimary}>Live Constructor</Heading>
                </HStack>
            </Box>
            <Flex direction="column" w="100%" flex={1} p={6} bg={theme.bgApp}
                overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                <Box w="100%" maxW="700px" mx="auto" pb={10}>
                    <HStack mb={6} spacing={4}>
                        <Button variant="ghost" leftIcon={<ArrowLeft size={16} />}
                            size="sm" color={theme.textPrimary} isDisabled _hover={{}}>
                            Voltar
                        </Button>
                        <Heading size="md" color={theme.textPrimary}>
                            Abertura de Ticket: {departmentName || "Novo Departamento"}
                        </Heading>
                    </HStack>
                    <Box bg={theme.bgApp} p={6} borderRadius="xl" borderWidth="1px"
                        borderColor={theme.cardBorder} shadow="sm">
                        {fields.length === 0 ? (
                            <Flex h="100px" align="center" justify="center"
                                borderStyle="dashed" borderWidth="2px"
                                borderColor={theme.cardBorder} borderRadius="xl">
                                <Text color={theme.textSecondary}>
                                    Adicione campos na etapa anterior para visualizar.
                                </Text>
                            </Flex>
                        ) : (
                            <DynamicFormRenderer
                                fields={visibleFields}
                                answers={previewAnswers}
                                onAnswerChange={handlePreviewAnswerChange}
                            />
                        )}
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};