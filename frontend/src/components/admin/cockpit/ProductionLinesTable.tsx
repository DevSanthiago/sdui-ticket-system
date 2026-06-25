import {
    VStack, Text, Center, Table, Thead, Tbody, Tr, Th, Flex,
    Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Skeleton, Td
} from '@chakra-ui/react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { ProductionLineRow } from './ProductionLineRow';
import type { ProductionLinesTableProps } from '../../../types';

const SkeletonLoader = () => {
    const theme = useMinimalTheme();
    return (
        <Table variant="simple">
            <Thead>
                <Tr borderColor={theme.cardBorder}>
                    {['100px', '60px', '150px', '80px', '100px', '50px'].map((w, i) => (
                        <Th key={i} borderColor={theme.cardBorder}><Skeleton h="20px" w={w} /></Th>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {[...Array(5)].map((_, i) => (
                    <Tr key={i} borderColor={theme.cardBorder}>
                        {[...Array(6)].map((_, j) => (
                            <Td key={j} borderColor={theme.cardBorder}><Skeleton h="20px" /></Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export const ProductionLinesTable = ({
    filteredLinesByPrefix, loading, searchTerm, onEdit, onAction, onActivate
}: ProductionLinesTableProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    if (loading) return <SkeletonLoader />;

    if (filteredLinesByPrefix.length === 0) {
        return (
            <Center py={10}>
                <VStack spacing={3}>
                    <Text fontSize="lg" color={theme.textSecondary}>
                        {searchTerm
                            ? "Nenhuma linha encontrada com esse termo de busca"
                            : "Nenhuma linha cadastrada"}
                    </Text>
                </VStack>
            </Center>
        );
    }

    return (
        <Tabs variant="unstyled" display="flex" flexDirection="column" h="100%">
            <Flex mb={8} flexShrink={0} py={3} overflowX="auto"
                sx={{
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-thumb': { background: theme.cardBorder, borderRadius: '9999px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                }}>
                <TabList position="relative" bg={theme.bgApp} p={1.5} mx="auto" flexShrink={0}
                    borderRadius="full" borderWidth="1px" borderColor={theme.cardBorder}
                    display="inline-flex">
                    {filteredLinesByPrefix.map((group) => (
                        <Tab key={group.prefix} borderRadius="full" px={5} py={2}
                            fontSize="sm" fontWeight="bold" color={theme.textSecondary} zIndex={2}
                            whiteSpace="nowrap" transition="color 0.3s"
                            _selected={{ color: isDarkMode ? 'black' : 'white' }}>
                            {group.prefixLabel} ({group.lines.length})
                        </Tab>
                    ))}
                    <TabIndicator position="absolute" top="6px" height="calc(100% - 12px)"
                        bg={isDarkMode ? 'white' : 'black'} borderRadius="full"
                        boxShadow={isDarkMode ? theme.toggleActiveShadow : 'md'} zIndex={1}
                        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important" />
                </TabList>
            </Flex>

            <TabPanels flex="1" overflow="hidden">
                {filteredLinesByPrefix.map((group) => (
                    <TabPanel key={group.prefix} px={0} h="100%" overflow="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr borderColor={theme.cardBorder}>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Nome</Th>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Prefixo</Th>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Descrição</Th>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Status</Th>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Criada em</Th>
                                    <Th color={theme.textSecondary} borderColor={theme.cardBorder}>Ações</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {group.lines.map((line) => (
                                    <ProductionLineRow
                                        key={line.id}
                                        line={line}
                                        onEdit={onEdit}
                                        onAction={onAction}
                                        onActivate={onActivate}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
};