import { useState, useRef, useCallback } from 'react';
import {
    Box, Flex, Heading, Text, SimpleGrid, HStack, VStack,
    Skeleton, SkeletonCircle, IconButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
    AnimatedClock, AnimatedChevronLeft, AnimatedFlame,
    AnimatedLayers, AnimatedTimer, AnimatedFactory
} from '../../../components/icons/NewAnimatedIcons';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useDowntimeHistorical } from '../../../hooks/analytics/useDowntimeHistorical';
import { useFullscreen } from '../../../hooks/expanded-analytics/useFullscreen';
import { StatCard } from '../../../components/analytics/StatCard';
import { ExpandedKpiCarrossel } from '../../../components/analytics/ExpandedKpiCarrossel';
import { HistoricalFilterBar } from '../../../components/analytics/historical/HistoricalFilterBar';
import { HistoricalVolumeChart } from '../../../components/analytics/historical/HistoricalVolumeChart';
import { DepartmentPerformanceTable } from '../../../components/analytics/historical/DepartmentPerformanceTable';
import { YELLOW_NEON } from '../../../constants/analytics/downtimeDashboardConstants';
import { formatChartDate, formatTooltipLabel, formatTooltipValue } from '../../../helpers/chartFormatters';
import type { ReactNode } from 'react';
import type { RechartsValueType } from '../../../types';

export const DowntimeHistorical = () => {
    const navigate = useNavigate();
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const [isBackHovered, setIsBackHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

    const {
        data, loading,
        showCalendar, setShowCalendar,
        rangeState, setRangeState,
        departments, departmentId, setDepartmentId,
        activeShiftFilter,
        groupBy, lineType,
        carrosselFilters,
        handleShiftFilterChange,
        handleCalendarClose,
        fetchMetrics,
        toggleLineType,
    } = useDowntimeHistorical();

    const chartDateFormatter = useCallback(
        (val: string | number) => formatChartDate(val, groupBy), [groupBy]);
    const tooltipLabelFormatter = useCallback(
        (val: ReactNode) => formatTooltipLabel(val, groupBy), [groupBy]);
    const tooltipValueFormatter = useCallback(
        (value: RechartsValueType) => formatTooltipValue(value), []);

    return (
        <Box h="100%" bg={theme.bgApp} p={{ base: 4, md: 8 }} overflowY="auto">
            <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
                <HStack spacing={4}>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <IconButton
                            aria-label="Voltar para a Home"
                            icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                            onClick={() => navigate('/')}
                            variant="ghost" color={theme.textPrimary}
                            _hover={{ bg: theme.buttonHoverBg }}
                            onMouseEnter={() => setIsBackHovered(true)}
                            onMouseLeave={() => setIsBackHovered(false)}
                        />
                    </Skeleton>
                    <SkeletonCircle size="10" isLoaded={!loading}>
                        <Box color={isDarkMode ? "white" : "black"}>
                            <AnimatedClock size={40} isHovered={!loading} />
                        </Box>
                    </SkeletonCircle>
                    <VStack align="start" spacing={0}>
                        <Skeleton isLoaded={!loading} borderRadius="md">
                            <Heading size="lg" color={theme.textPrimary}>Downtime Histórico</Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!loading} borderRadius="md" mt={1}>
                            <Text color={theme.textSecondary} fontSize="sm">
                                Análise de performance em períodos passados
                            </Text>
                        </Skeleton>
                    </VStack>
                </HStack>

                <HistoricalFilterBar
                    loading={loading}
                    isDarkMode={isDarkMode}
                    activeShiftFilter={activeShiftFilter}
                    departments={departments}
                    departmentId={departmentId}
                    rangeState={rangeState}
                    showCalendar={showCalendar}
                    onShiftFilterChange={handleShiftFilterChange}
                    onDepartmentChange={setDepartmentId}
                    onToggleCalendar={() => setShowCalendar(!showCalendar)}
                    onRangeChange={setRangeState}
                    onCalendarClose={handleCalendarClose}
                    onRefresh={fetchMetrics}
                />
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6} mb={8}>
                <StatCard label="Total de Tickets" value={data?.globalAnalytics.totalTickets ?? 0}
                    animatedIcon={<AnimatedLayers />} loading={loading}
                    helpText="Volume total no período selecionado" />
                <StatCard label="Tickets Em Aberto" value={data?.globalAnalytics.openTickets ?? 0}
                    animatedIcon={<AnimatedFlame />} loading={loading}
                    helpText="Chamados aguardando atendimento" />
                <StatCard label="Tempo de Resposta"
                    value={`${data?.globalAnalytics.averageResponseTimeMinutes.toFixed(1) ?? 0} min`}
                    animatedIcon={<AnimatedTimer />} loading={loading}
                    helpText="Média (Abertura → Aceite) MTTA" />
                <StatCard label="Tempo Atendimento"
                    value={`${data?.globalAnalytics.averageResolutionTimeMinutes.toFixed(1) ?? 0} min`}
                    animatedIcon={<AnimatedClock />} loading={loading}
                    helpText="Média (Aceite → Conclusão) MTTR" />
                <StatCard label="Impacto Produtivo"
                    value={`${data?.globalAnalytics.totalDowntimeHours.toFixed(1) ?? 0} hrs`}
                    animatedIcon={<AnimatedFactory />} loading={loading}
                    helpText="Total de Linha Parada" />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                <Box
                    ref={containerRef}
                    gridColumn={{ lg: "span 2" }}
                    bg={theme.cardBg} p={6}
                    borderRadius={isFullscreen ? "none" : "2xl"}
                    borderWidth={isFullscreen ? "0" : "1px"}
                    borderColor={theme.cardBorder}
                    minH="400px" display="flex" flexDirection="column"
                    w={isFullscreen ? "100%" : "auto"}
                    h={isFullscreen ? "100%" : "auto"}
                >
                    {isFullscreen && (
                        <ExpandedKpiCarrossel
                            globalData={data}
                            filters={carrosselFilters}
                            color={YELLOW_NEON}
                        />
                    )}
                    <HistoricalVolumeChart
                        loading={loading}
                        isDarkMode={isDarkMode}
                        data={data}
                        lineType={lineType}
                        isFullscreen={isFullscreen}
                        onToggleLineType={toggleLineType}
                        onToggleFullscreen={toggleFullscreen}
                        formatChartDate={chartDateFormatter}
                        formatTooltipLabel={tooltipLabelFormatter}
                        formatTooltipValue={tooltipValueFormatter}
                    />
                </Box>

                <DepartmentPerformanceTable
                    loading={loading}
                    isDarkMode={isDarkMode}
                    departmentAnalytics={data?.departmentAnalytics ?? []}
                />
            </SimpleGrid>
        </Box>
    );
};