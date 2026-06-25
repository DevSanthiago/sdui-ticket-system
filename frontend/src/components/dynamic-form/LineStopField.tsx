import { memo } from 'react';
import { Box, Flex, Text, Input } from '@chakra-ui/react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useLineStop } from '../../hooks/dynamic-form/useLineStop';
import { areDynamicFieldPropsEqual } from '../../helpers/formHelpers';
import type { LineStopFieldProps } from '../../types';

const LineStopFieldComponent = ({ field, answers, onChange }: LineStopFieldProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const {
        isStopped, time, handleStopChange,
        titleColor, activeColorHex, hasSelection,
        animationName, angleVar, animTrue, animFalse,
    } = useLineStop({ fieldId: field.id, answers, onChange });

    return (
        <>
            <style>{`
                @property ${angleVar} {
                    syntax: "<angle>";
                    initial-value: 0deg;
                    inherits: false;
                }
                @keyframes ${animTrue} {
                    from { ${angleVar}: 0deg; }
                    to { ${angleVar}: 360deg; }
                }
                @keyframes ${animFalse} {
                    from { ${angleVar}: 0deg; }
                    to { ${angleVar}: 360deg; }
                }
            `}</style>
            <Box
                p={4} bg={theme.bgApp} borderRadius="xl"
                position="relative" overflow="hidden"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                borderWidth="1px" borderStyle="solid"
                borderColor={hasSelection ? "transparent" : theme.cardBorder}
                boxShadow={hasSelection ? `0 8px 32px -10px ${activeColorHex}80` : "none"}
                _before={{
                    content: '""', position: "absolute", inset: "-150%",
                    transition: "opacity 0.2s ease", opacity: hasSelection ? 1 : 0, zIndex: 1,
                    background: `conic-gradient(from 0deg, ${activeColorHex} 0deg, ${activeColorHex} var(${angleVar}), transparent var(${angleVar}))`,
                    animation: hasSelection ? `${animationName} 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards` : "none",
                }}
                _after={{
                    content: '""', position: "absolute", inset: "2px",
                    bg: theme.bgApp, borderRadius: "calc(0.75rem - 1px)", zIndex: 2,
                    transition: "all 0.3s ease",
                }}
            >
                <Box position="relative" zIndex={3}>
                    <Flex justify="space-between" align="center" mb={isStopped ? 4 : 0}>
                        <Box>
                            <Text fontWeight="bold" fontSize="md"
                                color={titleColor} transition="color 0.3s ease">
                                {field.label || "A linha está parada?"}
                                {field.required && <Text as="span" color="red.500"> *</Text>}
                            </Text>
                            <Text fontSize="sm" color={theme.textSecondary} mt={1}>
                                Selecione a situação atual.
                            </Text>
                        </Box>
                        <Flex position="relative" borderWidth="1px" borderColor={theme.cardBorder}
                            borderRadius="md" p="2px"
                            bg={isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}>
                            <Box
                                position="absolute" top="2px" bottom="2px" left="2px"
                                w="calc(50% - 2px)" borderRadius="sm" zIndex={0}
                                bg={isStopped === true ? "#E53E3E" : isStopped === false ? "#38A169" : "transparent"}
                                opacity={isStopped === undefined || isStopped === null ? 0 : 0.15}
                                transform={isStopped === true ? "translateX(100%)" : "translateX(0)"}
                                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                            />
                            <Flex align="center" justify="center" w="70px" py={1.5}
                                cursor="pointer" position="relative" zIndex={1}
                                onClick={() => handleStopChange(false)}
                                color={isStopped === false ? "green.500" : theme.textSecondary}
                                transition="color 0.4s ease">
                                <Text fontSize="sm" fontWeight="bold">NÃO</Text>
                            </Flex>
                            <Flex align="center" justify="center" w="70px" py={1.5}
                                cursor="pointer" position="relative" zIndex={1}
                                onClick={() => handleStopChange(true)}
                                color={isStopped === true ? "red.500" : theme.textSecondary}
                                transition="color 0.4s ease">
                                <Text fontSize="sm" fontWeight="bold">SIM</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {isStopped && (
                        <Box mt={4} animation="fadeIn 0.3s">
                            <Text fontSize="sm" fontWeight="bold" color="red.500" mb={2}>
                                Horário da Parada
                            </Text>
                            <Input
                                type="time"
                                value={String(time)}
                                onChange={(e) => onChange(`${field.id}_time`, e.target.value)}
                                bg={theme.cardBg} borderColor="red.500" color={theme.textPrimary}
                                _hover={{ borderColor: "red.400" }}
                                _focus={{ borderColor: "red.500", boxShadow: "none" }}
                                sx={{
                                    '::-webkit-calendar-picker-indicator': {
                                        filter: isDarkMode ? 'invert(1)' : 'none',
                                        cursor: 'pointer'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};

export const LineStopField = memo(LineStopFieldComponent, areDynamicFieldPropsEqual);