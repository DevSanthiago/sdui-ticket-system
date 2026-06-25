import {
    Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
    DrawerHeader, DrawerBody, DrawerFooter, VStack, Box, Text,
    InputGroup, InputLeftElement, Input, Button, Flex, Icon, HStack
} from '@chakra-ui/react';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { CustomDateRange } from '../../components/ui/CustomDateRange';
import { useTicketFilterDrawer } from '../../hooks/tickets/useTicketFilterDrawer';
import { STATUS_OPTIONS } from '../../constants/tickets/ticketFilterConstants';
import type { TicketFilterDrawerProps, FormFieldSchema, FormFieldOption, ProductionLine } from '../../types';
import type { RangeKeyDict } from 'react-date-range';

export const TicketFilterDrawer = ({
    isOpen, onClose, searchQuery, onSearchChange,
    departments, dynamicFilters, onDynamicFilterChange,
    onClearFilters, startDate, endDate,
    onStartDateChange, onEndDateChange
}: TicketFilterDrawerProps) => {
    const theme = useMinimalTheme();
    const isDark = useColorModeValue(false, true);

    const {
        showCalendar, setShowCalendar,
        isClearHovered, setIsClearHovered,
        localSearchQuery, setLocalSearchQuery,
        localDynamicFilters, setLocalDynamicFilters,
        rangeState, setRangeState,
        filterableFields, groupedLines,
        hasActiveFilters,
        getDisplayDate, getPillProps,
        handleApply, handleClear,
    } = useTicketFilterDrawer({
        isOpen, isDark, searchQuery, dynamicFilters, departments,
        startDate, endDate, onSearchChange, onDynamicFilterChange,
        onStartDateChange, onEndDateChange, onClearFilters, onClose,
        theme: theme as Record<string, string>,
    });

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
            <DrawerOverlay backdropFilter="blur(4px)" />
            <DrawerContent bg={theme.bgApp} borderLeftWidth="1px" borderColor={theme.cardBorder}>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    Filtros Avançados
                </DrawerHeader>

                <DrawerBody p={6} css={{
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' }
                }}>
                    <VStack spacing={6} align="stretch">
                        <Box>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}
                                mb={2} textTransform="uppercase">
                                Busca por ID ou Linha
                            </Text>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={Search} boxSize={4}
                                        color={isDark ? "whiteAlpha.600" : "gray.500"} />
                                </InputLeftElement>
                                <Input
                                    placeholder="Digite o ID do ticket ou a linha..."
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                    bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                    _focus={{ borderColor: theme.textPrimary, boxShadow: 'none' }}
                                />
                            </InputGroup>
                        </Box>

                        <Box position="relative">
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}
                                mb={2} textTransform="uppercase">
                                Período
                            </Text>
                            <Button
                                w="full" h="40px" variant="unstyled" bg={theme.cardBg}
                                borderWidth="1px" borderColor={theme.cardBorder} borderRadius="md"
                                px={3} display="flex" justifyContent="flex-start" alignItems="center"
                                color={startDate ? theme.textPrimary : theme.textSecondary}
                                onClick={() => setShowCalendar(!showCalendar)}
                                _hover={{ borderColor: theme.textPrimary }}
                            >
                                <HStack spacing={2} w="full">
                                    <Icon as={CalendarIcon} size={16} color={theme.iconColor} />
                                    <Text fontSize="sm" fontWeight="normal">{getDisplayDate()}</Text>
                                </HStack>
                            </Button>

                            {showCalendar && (
                                <Box position="absolute" top="70px" left={0} zIndex={1500} w="full">
                                    <CustomDateRange
                                        rangeState={rangeState}
                                        onChange={(item: RangeKeyDict) => {
                                            const selection = item['selection'];
                                            if (selection) setRangeState([selection]);
                                        }}
                                        onClose={() => setShowCalendar(false)}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Box w="full" h="1px" bg={theme.cardBorder} my={2} />

                        <Box>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}
                                mb={3} textTransform="uppercase">
                                Status do Ticket
                            </Text>
                            <Flex wrap="wrap" gap={2}>
                                {STATUS_OPTIONS.map((opt) => {
                                    const isActive = (localDynamicFilters['status'] || '') === opt.value;
                                    return (
                                        <Button
                                            key={`status-${opt.value}`}
                                            {...getPillProps(isActive)}
                                            onClick={() => setLocalDynamicFilters(prev => ({
                                                ...prev, status: opt.value
                                            }))}
                                        >
                                            {opt.label}
                                        </Button>
                                    );
                                })}
                            </Flex>
                        </Box>

                        {filterableFields.map((field: FormFieldSchema) => {
                            if (field.type === 'dynamic_location') {
                                return (
                                    <Box key={field.id}>
                                        <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}
                                            mb={3} textTransform="uppercase">
                                            {field.label}
                                        </Text>
                                        <Box mb={4}>
                                            <Button
                                                {...getPillProps((localDynamicFilters[field.id] || '') === '')}
                                                onClick={() => setLocalDynamicFilters(prev => ({
                                                    ...prev, [field.id]: ''
                                                }))}
                                            >
                                                Todas as Linhas
                                            </Button>
                                        </Box>
                                        <VStack align="stretch" spacing={4}>
                                            {Object.entries(groupedLines)
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([prefix, lines]) => (
                                                    <Box key={`${field.id}-${prefix}`} pl={3}
                                                        borderLeftWidth="2px" borderColor={theme.cardBorder}>
                                                        <Text fontSize="10px" fontWeight="bold"
                                                            color={theme.textSecondary} mb={2}
                                                            textTransform="uppercase" letterSpacing="wider" opacity={0.8}>
                                                            Prefixo: {prefix}
                                                        </Text>
                                                        <Flex wrap="wrap" gap={2}>
                                                            {(lines as ProductionLine[]).map((pl, idx) => {
                                                                const isActive = localDynamicFilters[field.id] === String(pl.lineName);
                                                                return (
                                                                    <Button
                                                                        key={`${field.id}-${prefix}-${idx}`}
                                                                        {...getPillProps(isActive)}
                                                                        onClick={() => setLocalDynamicFilters(prev => ({
                                                                            ...prev, [field.id]: String(pl.lineName)
                                                                        }))}
                                                                    >
                                                                        {pl.lineName}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </Flex>
                                                    </Box>
                                                ))}
                                        </VStack>
                                    </Box>
                                );
                            }

                            const options: FormFieldOption[] = field.type === 'line_stop'
                                ? [{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]
                                : field.options || [];

                            return (
                                <Box key={field.id}>
                                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}
                                        mb={3} textTransform="uppercase">
                                        {field.label}
                                    </Text>
                                    <Flex wrap="wrap" gap={2}>
                                        <Button
                                            {...getPillProps((localDynamicFilters[field.id] || '') === '')}
                                            onClick={() => setLocalDynamicFilters(prev => ({
                                                ...prev, [field.id]: ''
                                            }))}
                                        >
                                            Todos
                                        </Button>
                                        {options.map((opt: FormFieldOption, idx: number) => {
                                            const isActive = localDynamicFilters[field.id] === String(opt.value);
                                            return (
                                                <Button
                                                    key={`${field.id}-${idx}`}
                                                    {...getPillProps(isActive)}
                                                    onClick={() => setLocalDynamicFilters(prev => ({
                                                        ...prev, [field.id]: String(opt.value)
                                                    }))}
                                                >
                                                    {opt.label}
                                                </Button>
                                            );
                                        })}
                                    </Flex>
                                </Box>
                            );
                        })}
                    </VStack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px" borderColor={theme.cardBorder} p={4}>
                    <Flex w="full" gap={3}>
                        <Button
                            variant="outline" flex={1} onClick={handleClear}
                            isDisabled={!hasActiveFilters}
                            borderColor="red.500" color="red.500"
                            leftIcon={
                                <Box display="flex" alignItems="center">
                                    <AnimatedIcons.AnimatedTornado size={16} isHovered={isClearHovered} />
                                </Box>
                            }
                            onMouseEnter={() => setIsClearHovered(true)}
                            onMouseLeave={() => setIsClearHovered(false)}
                            _hover={{
                                bg: isDark ? "rgba(229, 62, 62, 0.1)" : "red.50",
                                boxShadow: "0 0 12px rgba(229, 62, 62, 0.6)"
                            }}
                            _disabled={{
                                opacity: 0.4, cursor: "not-allowed",
                                borderColor: theme.cardBorder, color: theme.textSecondary,
                                boxShadow: "none",
                                _hover: { bg: "transparent", boxShadow: "none" }
                            }}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            Limpar Filtros
                        </Button>
                        <Button
                            variant="solid" flex={1} onClick={handleApply}
                            bg={isDark ? 'white' : 'black'}
                            color={isDark ? 'black' : 'white'}
                            _hover={{ opacity: 0.8 }}
                        >
                            Aplicar
                        </Button>
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};