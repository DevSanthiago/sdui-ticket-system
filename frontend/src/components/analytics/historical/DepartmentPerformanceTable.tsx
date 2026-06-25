import {
    Box, Heading, HStack, Text, Icon, Badge, Skeleton,
    TableContainer, Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react';
import { Trophy, Medal } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import type { DepartmentPerformanceTableProps, DepartmentAnalyticsDto } from '../../../types';

export const DepartmentPerformanceTable = ({
    loading, isDarkMode, departmentAnalytics
}: DepartmentPerformanceTableProps) => {
    const theme = useMinimalTheme();

    return (
        <Box bg={theme.cardBg} p={6} borderRadius="2xl" borderWidth="1px"
            borderColor={theme.cardBorder} h="100%">
            <Skeleton isLoaded={!loading} borderRadius="md" mb={6} w="fit-content">
                <Heading size="md" color={theme.textPrimary}>Performance por Depto</Heading>
            </Skeleton>
            <TableContainer>
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th color={theme.textSecondary}>Departamento</Th>
                            <Th color={theme.textSecondary} isNumeric>Tickets</Th>
                            <Th color={theme.textSecondary} isNumeric>MTTR (min)</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <Tr key={i}>
                                    <Td><Skeleton height="20px" /></Td>
                                    <Td><Skeleton height="20px" /></Td>
                                    <Td><Skeleton height="20px" /></Td>
                                </Tr>
                            ))
                        ) : departmentAnalytics.map((dept: DepartmentAnalyticsDto, index: number) => (
                            <Tr key={dept.departmentId}
                                _hover={{ bg: isDarkMode ? "whiteAlpha.50" : "blackAlpha.50" }}>
                                <Td fontWeight="bold" color={theme.textPrimary}>
                                    <HStack spacing={2}>
                                        {index === 0 && <Icon as={Trophy} color="yellow.400" boxSize={4} />}
                                        {index === 1 && <Icon as={Medal} color="gray.400" boxSize={4} />}
                                        {index === 2 && <Icon as={Medal} color="orange.400" boxSize={4} />}
                                        {index > 2 && <Box w="16px" />}
                                        <Text>{dept.departmentName}</Text>
                                    </HStack>
                                </Td>
                                <Td isNumeric color={theme.textPrimary}>{dept.totalTickets}</Td>
                                <Td isNumeric>
                                    <Badge colorScheme={dept.averageResolutionTimeMinutes > 60 ? "red" : "green"}
                                        borderRadius="full" px={2}>
                                        {dept.averageResolutionTimeMinutes.toFixed(0)}
                                    </Badge>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};