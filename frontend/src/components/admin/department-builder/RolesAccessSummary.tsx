import {
    Flex, HStack, Heading, Badge, Text, TableContainer,
    Table, Thead, Tr, Th, Tbody, Td, Center, Tooltip,
    Box, Icon, IconButton
} from '@chakra-ui/react';
import { ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import type { RolesAccessSummaryProps } from '../../../types';

export const RolesAccessSummary = ({
    allowedRoles, availableRoles, isDarkMode, onRemove
}: RolesAccessSummaryProps) => {
    const theme = useMinimalTheme();

    const greenNeon = "#48BB78";
    const orangeNeon = "#ED8936";
    const redNeon = "#F56565";
    const glowGreen = `drop-shadow(0 0 8px ${greenNeon})`;
    const glowOrange = `drop-shadow(0 0 8px ${orangeNeon})`;
    const glowRed = `drop-shadow(0 0 8px ${redNeon})`;

    return (
        <Flex flex={1} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px"
            borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
            <HStack w="100%" mb={4} justify="space-between">
                <Heading size="sm" color={theme.textPrimary}>Resumo de Acessos</Heading>
                <Badge borderRadius="full" px={2.5} py={0.5} fontSize="xs"
                    colorScheme="blue" fontWeight="bold">
                    {allowedRoles.length} Cargos
                </Badge>
            </HStack>

            {allowedRoles.length === 0 ? (
                <Flex flex={1} direction="column" align="center" justify="center" opacity={0.6} p={8}>
                    <ShieldAlert size={48} />
                    <Text mt={4} fontSize="sm" textAlign="center"
                        color={theme.textSecondary} lineHeight="tall">
                        Nenhum cargo específico adicionado.<br />
                        Apenas Cargos Admin poderão gerenciar este domínio.
                    </Text>
                </Flex>
            ) : (
                <TableContainer flex={1} overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <Table variant="simple" size="sm">
                        <Thead position="sticky" top={0} bg={theme.cardBg} zIndex={1}
                            boxShadow={`0 1px 0 ${theme.cardBorder}`}>
                            <Tr>
                                <Th color={theme.textSecondary} borderColor={theme.cardBorder}
                                    textAlign="center" width="60px">Status</Th>
                                <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Cargo</Th>
                                <Th color={theme.textSecondary} borderColor={theme.cardBorder}
                                    textAlign="center" width="60px">Ação</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {allowedRoles.map((role, idx) => {
                                const roleInfo = availableRoles.find(r => r.value === role);
                                const isOfficial = !!roleInfo;

                                return (
                                    <Tr key={idx}
                                        _hover={{ bg: isDarkMode ? "whiteAlpha.50" : "blackAlpha.50" }}
                                        transition="background 0.2s">
                                        <Td borderColor={theme.cardBorder}>
                                            <Center>
                                                <Tooltip label={isOfficial ? "Cargo Oficial" : "Cargo não mapeado"} hasArrow>
                                                    <Box display="flex"
                                                        style={{ filter: isOfficial ? glowGreen : glowOrange }}>
                                                        <Icon
                                                            as={isOfficial ? CheckCircle2 : ShieldAlert}
                                                            color={isOfficial ? greenNeon : orangeNeon}
                                                            size={20}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            </Center>
                                        </Td>
                                        <Td borderColor={theme.cardBorder}>
                                            <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                                                {roleInfo?.label || role}
                                            </Text>
                                            <Text fontSize="xs" color={theme.textSecondary}
                                                textTransform="lowercase" letterSpacing="wide">
                                                {role}
                                            </Text>
                                        </Td>
                                        <Td borderColor={theme.cardBorder}>
                                            <Center>
                                                <IconButton
                                                    aria-label="Remover cargo"
                                                    icon={<Trash2 size={18} />}
                                                    size="xs" variant="ghost"
                                                    onClick={() => onRemove(role)}
                                                    color={redNeon}
                                                    style={{ filter: glowRed }}
                                                    _hover={{
                                                        bg: isDarkMode ? "whiteAlpha.100" : "blackAlpha.50",
                                                        color: "red.400",
                                                        filter: `drop-shadow(0 0 15px ${redNeon})`,
                                                    }}
                                                    transition="all 0.3s ease"
                                                />
                                            </Center>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        </Flex>
    );
};