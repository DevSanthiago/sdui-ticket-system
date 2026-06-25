import { memo } from 'react';
import { Box, Text, Select, SimpleGrid } from '@chakra-ui/react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useDynamicLocation } from '../../hooks/dynamic-form/useDynamicLocation';
import { areDynamicFieldPropsEqual } from '../../helpers/formHelpers';
import type { DynamicLocationFieldProps, ProductionLine } from '../../types';

const DynamicLocationFieldComponent = ({ field, answers, onChange }: DynamicLocationFieldProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const selectBg = isDarkMode ? '#000000' : '#FFFFFF';
    const selectSx = { '> option': { bg: selectBg } };

    const { dbPrefixes, dbGroupedLines, selectedPrefix, handlePrefixChange } =
        useDynamicLocation({ fieldId: field.id, fieldType: field.type, onChange });

    return (
        <Box p={4} borderRadius="md" borderWidth="1px"
            borderColor={theme.cardBorder} bg={theme.bgApp}>
            <Text fontWeight="bold" fontSize="sm" color={theme.textPrimary} mb={4}>
                {field.label || "Informações da Linha"}
                {field.required && <Text as="span" color="red.500"> *</Text>}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={2}>
                        Categoria da Linha
                    </Text>
                    <Select
                        placeholder="Selecione a categoria..."
                        value={selectedPrefix}
                        onChange={(e) => handlePrefixChange(e.target.value)}
                        bg={selectBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                        sx={selectSx}>
                        {dbPrefixes.map((p, i) => (
                            <option key={i} value={p.value}>{p.label}</option>
                        ))}
                    </Select>
                </Box>
                <Box>
                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={2}>
                        Nome da Linha
                    </Text>
                    <Select
                        placeholder="Qual linha?"
                        isDisabled={!selectedPrefix}
                        value={String(answers[field.id] || '')}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        bg={selectBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                        sx={selectSx}>
                        {dbGroupedLines.find(g => g.prefix === selectedPrefix)?.lines?.map((l: ProductionLine, i: number) => (
                            <option key={i} value={l.id}>{l.lineName}</option>
                        ))}
                    </Select>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export const DynamicLocationField = memo(DynamicLocationFieldComponent, areDynamicFieldPropsEqual);