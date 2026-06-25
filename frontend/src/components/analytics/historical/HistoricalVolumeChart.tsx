import { Box, Flex, Heading, HStack, Button, IconButton, Icon, Text, Skeleton } from '@chakra-ui/react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { ChartSpline, TrendingUp, Minimize, Maximize } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { YELLOW_NEON, CHART_MARGIN } from '../../../constants/analytics/downtimeDashboardConstants';
import type { HistoricalVolumeChartProps } from '../../../types';

export const HistoricalVolumeChart = ({
    loading, isDarkMode, data, lineType, isFullscreen,
    onToggleLineType, onToggleFullscreen,
    formatChartDate, formatTooltipLabel, formatTooltipValue
}: HistoricalVolumeChartProps) => {
    const theme = useMinimalTheme();

    return (
        <>
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                <Skeleton isLoaded={!loading} borderRadius="md">
                    <Heading size="md" color={theme.textPrimary}>Volumetria Histórica de Tickets</Heading>
                </Skeleton>
                <Skeleton isLoaded={!loading} borderRadius="lg">
                    <HStack spacing={2}>
                        <Button size="sm" onClick={onToggleLineType}
                            leftIcon={<Icon as={lineType === 'monotone' ? ChartSpline : TrendingUp} boxSize={4} />}
                            bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'}
                            _hover={{ opacity: 0.8 }} borderRadius="md">
                            {lineType === 'monotone' ? 'Curvo' : 'Exato'}
                        </Button>
                        <IconButton aria-label="Tela Cheia" size="sm"
                            icon={<Icon as={isFullscreen ? Minimize : Maximize} boxSize={4} />}
                            onClick={onToggleFullscreen}
                            bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'}
                            _hover={{ opacity: 0.8 }} borderRadius="md" />
                    </HStack>
                </Skeleton>
            </Flex>

            <Box flex={1} w="100%" minH={isFullscreen ? "70vh" : "300px"}>
                {loading ? (
                    <Skeleton isLoaded={!loading} w="100%" h="100%" borderRadius="xl" />
                ) : data?.timeSeriesAnalytics && data.timeSeriesAnalytics.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.timeSeriesAnalytics} margin={CHART_MARGIN}>
                            <defs>
                                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={YELLOW_NEON} stopOpacity={0.5} />
                                    <stop offset="95%" stopColor={YELLOW_NEON} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}
                                stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false}
                                tick={{ fill: isDarkMode ? "#FFFFFF" : theme.textSecondary, fontSize: 12 }}
                                dy={10} tickFormatter={formatChartDate} />
                            <YAxis axisLine={false} tickLine={false}
                                tick={{ fill: isDarkMode ? "#FFFFFF" : theme.textSecondary, fontSize: 12 }} />
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1A202C' : '#FFFFFF',
                                    borderColor: theme.cardBorder, borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: theme.textPrimary
                                }}
                                itemStyle={{ color: YELLOW_NEON, fontWeight: 'bold' }}
                                labelStyle={{ color: theme.textSecondary, marginBottom: '8px' }}
                                labelFormatter={formatTooltipLabel}
                                formatter={formatTooltipValue}
                            />
                            <Area type={lineType} dataKey="ticketCount" stroke={YELLOW_NEON}
                                strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)"
                                activeDot={{ r: 6, fill: YELLOW_NEON, stroke: isDarkMode ? '#1A202C' : '#FFF', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <Flex h="100%" align="center" justify="center" direction="column" opacity={0.5}>
                        <TrendingUp size={48} color={theme.textSecondary} />
                        <Text mt={4} color={theme.textSecondary} fontWeight="bold">
                            Nenhum dado no período selecionado
                        </Text>
                    </Flex>
                )}
            </Box>
        </>
    );
};