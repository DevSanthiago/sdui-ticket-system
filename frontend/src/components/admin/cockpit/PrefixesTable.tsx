import {
    Table, Thead, Tbody, Tr, Th, Td, Badge,
    IconButton, Text, Center, VStack, Skeleton
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import type { PrefixesTableProps } from '../../../types';

const TableSkeleton = () => {
    const theme = useMinimalTheme();
    return (
        <Table variant="simple">
            <Thead>
                <Tr borderColor={theme.cardBorder}>
                    <Th borderColor={theme.cardBorder}><Skeleton h="15px" w="70%" /></Th>
                    <Th borderColor={theme.cardBorder}><Skeleton h="15px" w="80%" /></Th>
                    <Th borderColor={theme.cardBorder}><Skeleton h="15px" w="60%" /></Th>
                    <Th borderColor={theme.cardBorder}><Skeleton h="15px" w="40%" /></Th>
                </Tr>
            </Thead>
            <Tbody>
                {[...Array(5)].map((_, i) => (
                    <Tr key={i} borderColor={theme.cardBorder}>
                        <Td borderColor={theme.cardBorder}><Skeleton h="20px" /></Td>
                        <Td borderColor={theme.cardBorder}><Skeleton h="20px" /></Td>
                        <Td borderColor={theme.cardBorder}><Skeleton h="20px" /></Td>
                        <Td borderColor={theme.cardBorder}><Skeleton h="20px" /></Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export const PrefixesTable = ({ prefixes, loading, onDelete }: PrefixesTableProps) => {
    const theme = useMinimalTheme();

    if (loading) return <TableSkeleton />;

    if (prefixes.length === 0) {
        return (
            <Center py={10}>
                <VStack spacing={3}>
                    <Text fontSize="lg" color={theme.textSecondary}>
                        Nenhum prefixo cadastrado
                    </Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Table variant="simple">
            <Thead>
                <Tr borderColor={theme.cardBorder}>
                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Sigla (Value)</Th>
                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Rótulo (Label)</Th>
                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Status</Th>
                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Ações</Th>
                </Tr>
            </Thead>
            <Tbody>
                {prefixes.map((p) => (
                    <Tr key={p.id} _hover={{ bg: theme.buttonBg }} borderColor={theme.cardBorder}>
                        <Td borderColor={theme.cardBorder}>
                            <Badge bg={theme.badgeBg} color={theme.textPrimary}
                                border="1px solid" borderColor={theme.badgeBorder}>
                                {p.value}
                            </Badge>
                        </Td>
                        <Td borderColor={theme.cardBorder} fontWeight="bold" color={theme.textPrimary}>
                            {p.label}
                        </Td>
                        <Td borderColor={theme.cardBorder}>
                            {(() => {
                                const statusColor = p.isActive ? "#48BB78" : "#F56565";
                                return (
                                    <Badge
                                        bg="transparent" color={statusColor}
                                        border="1px solid" borderColor={statusColor}
                                        boxShadow={`0 0 10px ${statusColor}88, inset 0 0 8px ${statusColor}55`}
                                        px={2} py={0.5} borderRadius="md" textTransform="uppercase">
                                        {p.isActive ? "Ativo" : "Inativo"}
                                    </Badge>
                                );
                            })()}
                        </Td>
                        <Td borderColor={theme.cardBorder}>
                            <IconButton
                                aria-label="Excluir"
                                icon={<FaTrash />}
                                size="sm" colorScheme="red" variant="ghost"
                                onClick={() => onDelete(p)}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};