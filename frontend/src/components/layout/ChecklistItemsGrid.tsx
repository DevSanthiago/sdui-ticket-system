import { Box, Heading, Checkbox, Text } from '@chakra-ui/react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import type { ChecklistItemsGridProps } from '../../types';

export const ChecklistItemsGrid = ({
    items, safeChecks, isViewMode, isMonitor,
    allChecked, isIndeterminate,
    onCheckChange, onMasterChange,
}: ChecklistItemsGridProps) => {
    const theme = useMinimalTheme();

    const selectAllBg = 'rgba(59, 130, 246, 0.1)';
    const selectAllBorder = 'blue.500';
    const selectAllText = 'blue.200';

    if (items.length === 0) return null;

    return (
        <Box p={2}>
            <Heading size="sm" mb={4} textTransform="uppercase" color={theme.textSecondary}>
                Itens de Verificação
            </Heading>
            <Box sx={{ columnCount: { base: 1, md: 2, lg: 4 }, columnGap: '2rem' }}>
                {items.map((item, index) => (
                    <Box key={item.id} mb={4} sx={{ breakInside: 'avoid' }}>
                        <Checkbox
                            size="lg" colorScheme="green"
                            isDisabled={isViewMode}
                            isChecked={safeChecks[index] || false}
                            onChange={(e) => onCheckChange(index, e.target.checked)}
                        >
                            <Text fontWeight="bold" fontSize="sm" mt={1} color={theme.textPrimary}>
                                {item.label}
                            </Text>
                        </Checkbox>
                    </Box>
                ))}
            </Box>

            {isMonitor && (
                <Box mb={6} p={4} bg={selectAllBg} borderRadius="md"
                    borderWidth="1px" borderColor={selectAllBorder}>
                    <Checkbox
                        isChecked={allChecked} isIndeterminate={isIndeterminate}
                        onChange={onMasterChange} colorScheme="blue"
                        size="lg" isDisabled={isViewMode}>
                        <Text fontWeight="bold" color={selectAllText}>
                            Selecionar Todos os Itens
                        </Text>
                    </Checkbox>
                </Box>
            )}
        </Box>
    );
};