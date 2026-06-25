import {
    Box, Flex, Heading, HStack, VStack, Text, Select, Badge, Icon, Spinner
} from '@chakra-ui/react';
import { FaLink, FaInfoCircle } from 'react-icons/fa';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useChecklistDepartmentLink } from '../../../hooks/admin/useChecklistDepartmentLink';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import type { ChecklistLinkData } from '../../../types';

interface Props {
    link: ChecklistLinkData;
    onChange: <K extends keyof ChecklistLinkData>(field: K, value: ChecklistLinkData[K]) => void;
}

export const ChecklistLinkStep = ({ link, onChange }: Props) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { departments, loading, getTriggerableFields, getFieldOptions } = useChecklistDepartmentLink();

    const triggerableFields = getTriggerableFields(link.departmentId);
    const fieldOptions = getFieldOptions(link.departmentId, link.triggerFieldId);

    const inputProps = {
        bg: theme.buttonBg,
        borderColor: theme.cardBorder,
        color: theme.textPrimary,
        _focus: { borderColor: isDarkMode ? 'white' : 'black', boxShadow: 'none' },
    };

    const handleDepartmentChange = (value: string) => {
        const id = value ? Number(value) : null;
        onChange('departmentId', id);
        onChange('triggerFieldId', null);
        onChange('triggerFieldValue', null);
    };

    const handleFieldChange = (value: string) => {
        onChange('triggerFieldId', value || null);
        onChange('triggerFieldValue', null);
    };

    const selectedDept = departments.find(d => d.id === link.departmentId);
    const selectedField = triggerableFields.find(f => f.id === link.triggerFieldId);
    const selectedOption = fieldOptions.find(o => o.value === link.triggerFieldValue);
    const isFullyLinked = !!(link.departmentId && link.triggerFieldId && link.triggerFieldValue);

    return (
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: 'auto', lg: '460px' }} w="100%">
            <Box flex={1} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" h="100%" overflowY="auto"
                css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex"><Icon as={FaLink} boxSize={5} /></Box>
                    <Heading size="sm" color={theme.textPrimary}>Gatilho do Checklist</Heading>
                </HStack>

                {loading ? (
                    <Flex justify="center" py={10}><Spinner color={theme.textSecondary} /></Flex>
                ) : (
                    <VStack spacing={5} align="stretch">
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Departamento</Text>
                            <Select placeholder="Selecione um departamento..."
                                value={link.departmentId ?? ''}
                                onChange={(e) => handleDepartmentChange(e.target.value)} {...inputProps}>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Campo do formulário (gatilho)</Text>
                            <Select placeholder={link.departmentId ? 'Selecione o campo...' : 'Escolha o departamento primeiro'}
                                value={link.triggerFieldId ?? ''}
                                onChange={(e) => handleFieldChange(e.target.value)}
                                isDisabled={!link.departmentId || triggerableFields.length === 0} {...inputProps}>
                                {triggerableFields.map(f => (
                                    <option key={f.id} value={f.id}>{f.label}</option>
                                ))}
                            </Select>
                            {link.departmentId && triggerableFields.length === 0 && (
                                <Text fontSize="xs" color="orange.400" mt={1}>
                                    Este departamento não possui campos de seleção que sirvam de gatilho.
                                </Text>
                            )}
                        </Box>

                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Valor que dispara o checklist</Text>
                            <Select placeholder={link.triggerFieldId ? 'Selecione o valor...' : 'Escolha o campo primeiro'}
                                value={link.triggerFieldValue ?? ''}
                                onChange={(e) => onChange('triggerFieldValue', e.target.value || null)}
                                isDisabled={!link.triggerFieldId} {...inputProps}>
                                {fieldOptions.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </Select>
                        </Box>
                    </VStack>
                )}
            </Box>

            <Flex flex={1} bg={theme.bgApp} p={5} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%">
                <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex"><AnimatedIcons.AnimatedFileCheck2 size={20} /></Box>
                    <Heading size="sm" color={theme.textPrimary}>Resumo da Regra</Heading>
                </HStack>

                <Flex flex={1} align="center" justify="center">
                    {isFullyLinked ? (
                        <VStack spacing={4} textAlign="center" px={4}>
                            <Text color={theme.textSecondary} fontSize="sm">
                                Quando um ticket do departamento
                            </Text>
                            <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="md">
                                {selectedDept?.name}
                            </Badge>
                            <Text color={theme.textSecondary} fontSize="sm">
                                for resolvido com <b>{selectedField?.label}</b> igual a
                            </Text>
                            <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="md">
                                {selectedOption?.label}
                            </Badge>
                            <Text color={theme.textSecondary} fontSize="sm">
                                este checklist será gerado automaticamente para o solicitante.
                            </Text>
                        </VStack>
                    ) : (
                        <VStack spacing={3} textAlign="center" px={6} color={theme.textSecondary}>
                            <Icon as={FaInfoCircle} boxSize={8} opacity={0.5} />
                            <Text fontSize="sm">
                                Configure o departamento, o campo e o valor para definir quando este
                                checklist deve ser disparado. Sem vínculo, ele fica disponível apenas
                                como modelo (não é gerado automaticamente).
                            </Text>
                        </VStack>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
