import { memo, useState } from 'react';
import { Grid, GridItem, Button, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import * as AnimatedIcons from '../icons/NewAnimatedIcons';
import { areDynamicFieldPropsEqual } from '../../helpers/formHelpers';
import type { CardRadioFieldProps, FormFieldOption } from '../../types';

const CardRadioFieldComponent = ({ field, answers, onChange }: CardRadioFieldProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const activeRadioBg = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.03)";
    const activeRadioBorder = isDarkMode ? "white" : "black";
    const activeRadioShadow = isDarkMode ? "0 0 15px rgba(255, 255, 255, 0.4)" : "0 0 10px rgba(0, 0, 0, 0.2)";
    const activeRadioColor = isDarkMode ? "white" : "black";

    const total = field.options?.length ?? 0;

    return (
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(6, 1fr)" }} gap={4}>
            {field.options?.map((o: FormFieldOption, i: number) => {
                const isLastRow = Math.floor(i / 3) === Math.ceil(total / 3) - 1;
                const remainder = total % 3;

                let colSpan = 2;
                if (isLastRow && remainder === 1) colSpan = 6;
                if (isLastRow && remainder === 2) colSpan = 3;

                const iconKey = o.iconName as keyof typeof AnimatedIcons;
                const OptPreviewIcon = iconKey ? AnimatedIcons[iconKey] : null;

                const isSelected = answers[field.id] === o.value;
                const isCardHovered = hoveredCard === o.value;

                return (
                    <GridItem key={i} colSpan={{ base: 1, md: colSpan }} display="flex" w="100%">
                        <Button
                            w="100%" h="100%" minH="80px" py={3}
                            whiteSpace="normal" variant="outline"
                            display="flex" flexDirection="column" gap={2}
                            bg={isSelected ? activeRadioBg : theme.cardBg}
                            borderColor={isSelected ? activeRadioBorder : theme.cardBorder}
                            boxShadow={isSelected ? activeRadioShadow : "none"}
                            color={isSelected ? activeRadioColor : theme.textPrimary}
                            onClick={() => onChange(field.id, o.value)}
                            onMouseEnter={() => setHoveredCard(o.value)}
                            onMouseLeave={() => setHoveredCard(null)}
                            _hover={{
                                borderColor: isSelected ? activeRadioBorder : theme.cardBorderHover,
                                transform: "translateY(-2px)",
                                shadow: isSelected ? activeRadioShadow : "sm"
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            {OptPreviewIcon && (
                                <OptPreviewIcon size={24} isHovered={isSelected || isCardHovered} />
                            )}
                            <Text fontSize="sm" fontWeight={isSelected ? "bold" : "normal"}
                                textAlign="center" lineHeight="1.2" noOfLines={2}>
                                {o.label || 'Opção'}
                            </Text>
                        </Button>
                    </GridItem>
                );
            })}
        </Grid>
    );
};

export const CardRadioField = memo(CardRadioFieldComponent, areDynamicFieldPropsEqual);