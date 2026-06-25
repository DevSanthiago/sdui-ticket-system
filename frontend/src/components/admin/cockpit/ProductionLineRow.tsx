import { Tr, Td, Badge, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaEdit, FaCheck, FaTimes, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import type { ProductionLineRowProps } from '../../../types';

export const ProductionLineRow = ({ line, onEdit, onAction, onActivate }: ProductionLineRowProps) => {
    const theme = useMinimalTheme();

    return (
        <Tr borderColor={theme.cardBorder}>
            <Td fontWeight="bold" color={theme.textPrimary} borderColor={theme.cardBorder}>
                {line.lineName}
            </Td>
            <Td borderColor={theme.cardBorder}>
                <Badge bg={theme.badgeBg} color={theme.textPrimary} border="1px solid"
                    borderColor={theme.badgeBorder} fontSize="xs">
                    {line.prefix}
                </Badge>
            </Td>
            <Td maxW="300px" isTruncated borderColor={theme.cardBorder} color={theme.textSecondary}>
                {line.description || "-"}
            </Td>
            <Td borderColor={theme.cardBorder}>
                {(() => {
                    const statusColor = line.isActive ? "#48BB78" : "#F56565";
                    return (
                        <Badge
                            bg="transparent" color={statusColor}
                            border="1px solid" borderColor={statusColor}
                            boxShadow={`0 0 10px ${statusColor}88, inset 0 0 8px ${statusColor}55`}
                            px={2} py={0.5} borderRadius="md" textTransform="uppercase">
                            {line.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                    );
                })()}
            </Td>
            <Td fontSize="sm" color={theme.textSecondary} borderColor={theme.cardBorder}>
                {new Date(line.createdAt).toLocaleDateString("pt-BR")}
            </Td>
            <Td borderColor={theme.cardBorder}>
                <Menu>
                    <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="ghost" size="sm" />
                    <MenuList bg={theme.cardBg} borderColor={theme.cardBorder}>
                        <MenuItem bg={theme.cardBg} color={theme.textPrimary} icon={<FaEdit />}
                            onClick={() => onEdit(line)} _hover={{ bg: theme.buttonHoverBg }}>
                            Editar
                        </MenuItem>
                        {line.isActive ? (
                            <>
                                <MenuItem bg={theme.cardBg} icon={<FaTimes />} color="orange.500"
                                    onClick={() => onAction(line, 'deactivate')}
                                    _hover={{ bg: theme.buttonHoverBg }}>
                                    Desativar
                                </MenuItem>
                                <MenuItem bg={theme.cardBg} icon={<FaTrash />} color="red.500"
                                    onClick={() => onAction(line, 'delete')}
                                    _hover={{ bg: theme.buttonHoverBg }}>
                                    Excluir Permanentemente
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem bg={theme.cardBg} icon={<FaCheck />} color="green.500"
                                    onClick={() => onActivate(line)}
                                    _hover={{ bg: theme.buttonHoverBg }}>
                                    Ativar
                                </MenuItem>
                                <MenuItem bg={theme.cardBg} icon={<FaTrash />} color="red.500"
                                    onClick={() => onAction(line, 'delete')}
                                    _hover={{ bg: theme.buttonHoverBg }}>
                                    Excluir Permanentemente
                                </MenuItem>
                            </>
                        )}
                    </MenuList>
                </Menu>
            </Td>
        </Tr>
    );
};