import React from 'react';
import { Box, Text, Input, Textarea, Select } from '@chakra-ui/react';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { DynamicLocationField } from './DynamicLocationField';
import { LineStopField } from './LineStopField';
import { CardRadioField } from './CardRadioField';
import { areDynamicFieldPropsEqual } from '../../helpers/formHelpers';
import type { DynamicFieldProps, FormFieldOption } from '../../types';

const DynamicFieldComponent: React.FC<DynamicFieldProps> = ({ field, answers, onChange }) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const selectBg = isDarkMode ? '#000000' : '#FFFFFF';

    return (
        <Box w="full">
            {field.type !== 'dynamic_location' && field.type !== 'line_stop' && (
                <Text fontWeight="bold" fontSize="sm" color={theme.textPrimary} mb={3}>
                    {field.label}
                    {field.required && <Text as="span" color="red.500"> *</Text>}
                </Text>
            )}

            {(field.type === 'text' || field.type === 'setup_material') && (
                <Input
                    placeholder="Sua resposta"
                    value={String(answers[field.id] || '')}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                />
            )}

            {field.type === 'textarea' && (
                <Textarea
                    rows={3}
                    placeholder="Para agilizar o atendimento, informe o máximo de detalhes possível."
                    value={String(answers[field.id] || '')}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                />
            )}

            {field.type === 'select' && (
                <Select
                    placeholder="Selecione..."
                    value={String(answers[field.id] || '')}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    bg={selectBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                    sx={{ '> option': { bg: selectBg } }}
                >
                    {field.options?.map((o: FormFieldOption, i: number) => (
                        <option key={i} value={o.value}>{o.label}</option>
                    ))}
                </Select>
            )}

            {field.type === 'dynamic_location' && (
                <DynamicLocationField field={field} answers={answers} onChange={onChange} />
            )}

            {field.type === 'line_stop' && (
                <LineStopField field={field} answers={answers} onChange={onChange} />
            )}

            {field.type === 'card_radio' && (
                <CardRadioField field={field} answers={answers} onChange={onChange} />
            )}
        </Box>
    );
};

export const DynamicField = React.memo(DynamicFieldComponent, areDynamicFieldPropsEqual);