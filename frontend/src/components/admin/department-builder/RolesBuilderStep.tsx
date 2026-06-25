import {
    Box, Flex, Heading, VStack, HStack, Text,
    Button, Skeleton, Center
} from '@chakra-ui/react';
import { Plus, Minus, ShieldAlert } from 'lucide-react';
import { ListFilter } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useRolesBuilder } from '../../../hooks/admin/useRolesBuilder';
import { RolesAccessSummary } from './RolesAccessSummary';
import type { RolesBuilderStepProps } from '../../../types';

export const RolesBuilderStep = ({ allowedRoles, onChange }: RolesBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const {
        availableRoles, isLoadingRoles,
        orangeNeon, glowOrange, textGlowOrange,
        activePillColor, activePillShadow,
        handleRemoveRole, handleAddRole,
    } = useRolesBuilder(isDarkMode);

    return (
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }}
            h={{ base: "auto", lg: "480px" }} w="100%">
            <Box flex={1.3} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" h="100%" overflowY="auto"
                css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex">
                        <ListFilter size={20} />
                    </Box>
                    <Heading size="sm" color={theme.textPrimary}>Seleção de Cargos Autorizados</Heading>
                </HStack>

                <VStack spacing={8} align="stretch">
                    <Box>
                        <Text fontSize="sm" fontWeight="bold" mb={4} color={theme.textSecondary}>
                            Clique nos cargos mapeados no Access Control para adicioná-los:
                        </Text>

                        {isLoadingRoles ? (
                            <Flex wrap="wrap" gap={3}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <Skeleton key={s} height="36px" width="140px" borderRadius="full" />
                                ))}
                            </Flex>
                        ) : availableRoles.length > 0 ? (
                            <Flex wrap="wrap" gap={3}>
                                {availableRoles.map(role => {
                                    const isSelected = allowedRoles.includes(role.value);
                                    return (
                                        <Button
                                            key={role.value}
                                            size="sm" variant="outline" borderRadius="full"
                                            px={4} h="36px" bg="transparent"
                                            color={isSelected ? activePillColor : theme.textSecondary}
                                            borderColor={isSelected ? activePillColor : theme.cardBorder}
                                            boxShadow={isSelected ? activePillShadow : "none"}
                                            onClick={() => isSelected
                                                ? handleRemoveRole(role.value, allowedRoles, onChange)
                                                : handleAddRole(role.value, allowedRoles, onChange)
                                            }
                                            leftIcon={isSelected
                                                ? <Minus size={14} color={activePillColor} />
                                                : <Plus size={14} />
                                            }
                                            _hover={{
                                                borderColor: isSelected ? activePillColor : theme.textPrimary,
                                                bg: "transparent",
                                                boxShadow: isSelected ? activePillShadow : "none",
                                                transform: isSelected ? "none" : "translateY(-1px)"
                                            }}
                                            _active={{ bg: "transparent" }}
                                            transition="all 0.3s ease-in-out"
                                        >
                                            {role.label}
                                        </Button>
                                    );
                                })}
                            </Flex>
                        ) : (
                            <Center p={6} borderRadius="md" bg={theme.bgApp}
                                borderWidth="1px" borderColor={theme.cardBorder} borderStyle="dashed">
                                <Text fontSize="xs" color={theme.textSecondary} fontStyle="italic">
                                    Nenhum cargo disponível no Access Control para este ambiente.
                                </Text>
                            </Center>
                        )}
                    </Box>

                    <Flex p={5} borderRadius="xl" gap={4} align="center"
                        bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}
                        border="2px dashed" borderColor={orangeNeon}>
                        <ShieldAlert size={32} color={orangeNeon} style={{ filter: glowOrange }} />
                        <VStack align="stretch" spacing={0}>
                            <Text fontSize="sm" fontWeight="bold" color={orangeNeon}
                                style={{ textShadow: textGlowOrange }}>
                                Regras Globais Ativas
                            </Text>
                            <Text fontSize="xs" color={theme.textSecondary}>
                                O cargo <strong>admin</strong> possui acesso total por padrão.
                            </Text>
                        </VStack>
                    </Flex>
                </VStack>
            </Box>

            <RolesAccessSummary
                allowedRoles={allowedRoles}
                availableRoles={availableRoles}
                isDarkMode={isDarkMode}
                onRemove={(role) => handleRemoveRole(role, allowedRoles, onChange)}
            />
        </Flex>
    );
};