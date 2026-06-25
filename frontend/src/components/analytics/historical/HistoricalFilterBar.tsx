import {
    HStack, Box, Button, Icon, Text, Menu, MenuButton, MenuList, MenuItem, Skeleton
} from '@chakra-ui/react';
import { Filter, ChevronDown, Calendar, RefreshCcw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { CustomDateRange } from '../../ui/CustomDateRange';
import { YELLOW_NEON, SHIFT_FILTERS } from '../../../constants/analytics/downtimeDashboardConstants';
import type { HistoricalFilterBarProps, DateRangeState } from '../../../types';
import type { RangeKeyDict } from 'react-date-range';

export const HistoricalFilterBar = ({
    loading, isDarkMode, activeShiftFilter, departments, departmentId,
    rangeState, showCalendar, onShiftFilterChange, onDepartmentChange,
    onToggleCalendar, onRangeChange, onCalendarClose, onRefresh
}: HistoricalFilterBarProps) => {
    const theme = useMinimalTheme();

    return (
        <Skeleton isLoaded={!loading} borderRadius="2xl">
            <HStack spacing={1} bg={isDarkMode ? "#000000" : "white"} p={2}
                borderRadius="2xl" borderWidth="1px" borderColor={theme.cardBorder}>

                <HStack px={2} borderRightWidth="1px" borderColor={theme.cardBorder}>
                    <Icon as={Clock} boxSize={4}
                        color={activeShiftFilter !== '' ? YELLOW_NEON : theme.iconColor} />
                    <Menu matchWidth>
                        <MenuButton as={Button} variant="unstyled"
                            rightIcon={<Icon as={ChevronDown} boxSize={4} />}
                            w={{ base: "140px", md: "150px" }} textAlign="left"
                            fontWeight={activeShiftFilter !== '' ? "bold" : "normal"}
                            color={activeShiftFilter !== '' ? YELLOW_NEON : theme.textPrimary}
                            display="flex" alignItems="center" _hover={{ opacity: 0.8 }}>
                            <Text isTruncated fontSize="sm" mt="2px">
                                {SHIFT_FILTERS.find(s => s.value === activeShiftFilter)?.label || 'Período Completo'}
                            </Text>
                        </MenuButton>
                        <MenuList bg={isDarkMode ? "#000000" : "white"}
                            borderColor={isDarkMode ? "whiteAlpha.200" : "gray.200"}
                            boxShadow="xl" py={2} zIndex={100}>
                            <MenuItem bg="transparent" color={theme.textPrimary}
                                _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }}
                                onClick={() => onShiftFilterChange('')} fontSize="sm">
                                Período Completo
                            </MenuItem>
                            {SHIFT_FILTERS.map(shift => (
                                <MenuItem key={shift.value} bg="transparent" color={theme.textPrimary}
                                    _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }}
                                    onClick={() => onShiftFilterChange(shift.value)} fontSize="sm">
                                    {shift.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </HStack>

                <HStack px={2} borderRightWidth="1px" borderColor={theme.cardBorder}>
                    <Icon as={Filter} boxSize={4} color={theme.iconColor} />
                    <Menu matchWidth>
                        <MenuButton as={Button} variant="unstyled"
                            rightIcon={<Icon as={ChevronDown} boxSize={4} />}
                            w={{ base: "140px", md: "180px" }} textAlign="left"
                            fontWeight="normal" color={theme.textPrimary}
                            display="flex" alignItems="center" _hover={{ opacity: 0.8 }}>
                            <Text isTruncated fontSize="sm" mt="2px">
                                {departmentId === ''
                                    ? 'Downtime por departamento'
                                    : departments.find(d => d.id.toString() === departmentId)?.name || 'Todos os Deptos'}
                            </Text>
                        </MenuButton>
                        <MenuList bg={isDarkMode ? "#000000" : "white"}
                            borderColor={isDarkMode ? "whiteAlpha.200" : "gray.200"}
                            boxShadow="xl" py={2} zIndex={100}>
                            <MenuItem bg="transparent" color={theme.textPrimary}
                                _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }}
                                onClick={() => onDepartmentChange('')} fontSize="sm">
                                Downtime por departamento
                            </MenuItem>
                            {departments.map(dept => (
                                <MenuItem key={dept.id} bg="transparent" color={theme.textPrimary}
                                    _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }}
                                    onClick={() => onDepartmentChange(dept.id.toString())} fontSize="sm">
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </HStack>

                <Box position="relative" borderRightWidth="1px" borderColor={theme.cardBorder} pr={2}>
                    <Button variant="unstyled" px={2} display="flex" alignItems="center"
                        color={theme.textPrimary} onClick={onToggleCalendar} _hover={{ opacity: 0.8 }}>
                        <HStack spacing={2}>
                            <Icon as={Calendar} boxSize={4} color={theme.iconColor} />
                            <Text fontSize="sm" fontWeight="normal" mt="1px">
                                {rangeState[0].startDate.getTime() === rangeState[0].endDate.getTime()
                                    ? format(rangeState[0].startDate, 'dd/MM/yyyy')
                                    : `${format(rangeState[0].startDate, 'dd/MM/yyyy')} até ${format(rangeState[0].endDate, 'dd/MM/yyyy')}`}
                            </Text>
                        </HStack>
                    </Button>
                    {showCalendar && (
                        <Box position="absolute" top="100%" right={{ base: -20, md: 0 }} zIndex={1500} mt={4}>
                            <CustomDateRange
                                rangeState={rangeState}
                                onChange={(item: RangeKeyDict) => {
                                    if (item.selection) onRangeChange([item.selection as DateRangeState]);
                                }}
                                onClose={onCalendarClose}
                            />
                        </Box>
                    )}
                </Box>

                <Button size="sm" ml={2} leftIcon={<Icon as={RefreshCcw} boxSize={4} />}
                    onClick={onRefresh} isLoading={loading}
                    bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'}
                    _hover={{ opacity: 0.8 }} borderRadius="xl">
                    Atualizar
                </Button>
            </HStack>
        </Skeleton>
    );
};