import { useState } from 'react';
import {
    Box, Flex, Heading, HStack, VStack, SimpleGrid, Button, Text, Input, Select, Checkbox, IconButton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { StaticFileText, StaticIdCard } from '../../icons/StaticIcons';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import type { ChecklistMetaBuilderStepProps, ChecklistFieldSchema, ChecklistFieldType } from '../../../types';

const createField = (): ChecklistFieldSchema => ({
    id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? `field_${crypto.randomUUID()}`
        : `field_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'text',
    label: '',
    required: false,
    readOnly: false,
});

export const ChecklistMetaBuilderStep = ({
    meta, onMetaChange, fields, onFieldsChange
}: ChecklistMetaBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const [isAddHovered, setIsAddHovered] = useState(false);

    const inputProps = {
        bg: theme.buttonBg,
        borderColor: theme.cardBorder,
        color: theme.textPrimary,
        _focus: { borderColor: isDarkMode ? 'white' : 'black', boxShadow: 'none' },
    };

    const handleAddField = () => onFieldsChange([...fields, createField()]);

    const handleUpdateField = <K extends keyof ChecklistFieldSchema>(index: number, key: K, value: ChecklistFieldSchema[K]) => {
        const next = [...fields];
        next[index] = { ...next[index], [key]: value };
        onFieldsChange(next);
    };

    const handleRemoveField = (index: number) => {
        onFieldsChange(fields.filter((_, i) => i !== index));
    };

    return (
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: 'auto', lg: '500px' }} w="100%">
            <Box flex={1} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" h="100%" overflowY="auto"
                css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex"><StaticIdCard size={20} /></Box>
                    <Heading size="sm" color={theme.textPrimary}>Informações do Documento</Heading>
                </HStack>
                <VStack spacing={4} align="stretch">
                    <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Título do Checklist</Text>
                        <Input placeholder="Ex: Checklist Engenharia de Setup" value={meta.title}
                            onChange={(e) => onMetaChange('title', e.target.value)} {...inputProps} />
                    </Box>
                    <SimpleGrid columns={2} gap={4}>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Código do Documento</Text>
                            <Input placeholder="Ex: FI 12 70" value={meta.documentCode}
                                onChange={(e) => onMetaChange('documentCode', e.target.value)} {...inputProps} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Revisão</Text>
                            <Input placeholder="Ex: Rev 02: 15/04/2025" value={meta.revision}
                                onChange={(e) => onMetaChange('revision', e.target.value)} {...inputProps} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Data de Emissão</Text>
                            <Input placeholder="Ex: 16/10/2024" value={meta.emissionDate}
                                onChange={(e) => onMetaChange('emissionDate', e.target.value)} {...inputProps} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Departamento Atuante</Text>
                            <Input placeholder="Ex: Engenharia Industrial" value={meta.actingDepartment}
                                onChange={(e) => onMetaChange('actingDepartment', e.target.value)} {...inputProps} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Elaborado por</Text>
                            <Input placeholder="Ex: Renato Miranda" value={meta.elaboratedBy}
                                onChange={(e) => onMetaChange('elaboratedBy', e.target.value)} {...inputProps} />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Aprovado por</Text>
                            <Input placeholder="Ex: Helton Giacomini" value={meta.approvedBy}
                                onChange={(e) => onMetaChange('approvedBy', e.target.value)} {...inputProps} />
                        </Box>
                    </SimpleGrid>
                </VStack>
            </Box>

            <Flex flex={1} bg={theme.cardBg} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
                <Box w="100%" pt={5} px={5} bg={theme.cardBg} zIndex={1}>
                    <Flex justify="space-between" align="center" pb={3}
                        borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <HStack>
                            <Box color={theme.iconColor} display="flex"><StaticFileText size={20} /></Box>
                            <Heading size="sm" color={theme.textPrimary}>Campos do Formulário</Heading>
                        </HStack>
                        <Button
                            leftIcon={<AnimatedIcons.AnimatedPlus size={16} isHovered={isAddHovered} />}
                            bg={isDarkMode ? 'white' : 'black'}
                            color={isDarkMode ? 'black' : 'white'}
                            _hover={{ bg: isDarkMode ? 'gray.200' : 'gray.800' }}
                            size="sm" onClick={handleAddField}
                            onMouseEnter={() => setIsAddHovered(true)}
                            onMouseLeave={() => setIsAddHovered(false)}>
                            Novo Campo
                        </Button>
                    </Flex>
                </Box>
                <Box flex={1} w="100%" p={5} overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <VStack spacing={3} align="stretch">
                        {fields.length === 0 && (
                            <Box textAlign="center" p={6} bg={theme.bgApp} borderRadius="lg"
                                borderStyle="dashed" borderWidth="1px" borderColor={theme.cardBorder}>
                                <Text color={theme.textSecondary}>Nenhum campo no formulário do checklist.</Text>
                            </Box>
                        )}
                        {fields.map((field, index) => (
                            <Box key={field.id} p={3} bg={theme.bgApp} borderRadius="lg"
                                borderWidth="1px" borderColor={theme.cardBorder}>
                                <HStack mb={2}>
                                    <Input flex={1} size="sm" placeholder="Rótulo do campo"
                                        value={field.label}
                                        onChange={(e) => handleUpdateField(index, 'label', e.target.value)}
                                        {...inputProps} />
                                    <Select w="130px" size="sm" value={field.type}
                                        onChange={(e) => handleUpdateField(index, 'type', e.target.value as ChecklistFieldType)}
                                        {...inputProps}>
                                        <option value="text">Texto</option>
                                        <option value="textarea">Parágrafo</option>
                                    </Select>
                                    <IconButton aria-label="Remover campo" icon={<FaTrash />} size="sm"
                                        variant="ghost" colorScheme="red"
                                        _hover={{ bg: 'red.500', color: 'white' }}
                                        onClick={() => handleRemoveField(index)} />
                                </HStack>
                                <HStack spacing={6}>
                                    <Checkbox size="sm" colorScheme="green" isChecked={!!field.required}
                                        onChange={(e) => handleUpdateField(index, 'required', e.target.checked)}>
                                        <Text fontSize="xs" color={theme.textSecondary}>Obrigatório</Text>
                                    </Checkbox>
                                    <Checkbox size="sm" colorScheme="blue" isChecked={!!field.readOnly}
                                        onChange={(e) => handleUpdateField(index, 'readOnly', e.target.checked)}>
                                        <Text fontSize="xs" color={theme.textSecondary}>Somente leitura</Text>
                                    </Checkbox>
                                </HStack>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Flex>
        </Flex>
    );
};
