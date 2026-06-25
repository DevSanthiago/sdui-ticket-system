import { Box, Flex, Heading, Skeleton, HStack, IconButton, Icon, Button, Text } from '@chakra-ui/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ChartSpline, TrendingUp, Minimize, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { CYAN_GREEN, CHART_MARGIN } from '../../../constants/analytics/downtimeDashboardConstants';
import type { LiveVolumeChartProps } from '../../../types';

export const LiveVolumeChart = ({
    data, loading, containerRef, isFullscreen, toggleFullscreen,
    lineType, toggleLineType, chartFormatters
}: LiveVolumeChartProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    return (
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
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                <Skeleton isLoaded={!loading} borderRadius="md">
                    <Heading size="md" color={theme.textPrimary}>Volumetria de Tickets</Heading>
                </Skeleton>
                <Skeleton isLoaded={!loading} borderRadius="lg">
                    <HStack spacing={3}>
                        <Flex h="32px" px={3} borderRadius="md" bg="red.600" alignItems="center" boxShadow="sm">
                            <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                <HStack spacing={2}>
                                    <Box w="8px" h="8px" borderRadius="full" bg="white" />
                                    <Text fontSize="xs" fontWeight="bold" color="white" letterSpacing="wider" mt="1px">LIVE</Text>
                                </HStack>
                            </motion.div>
                        </Flex>
                        <Button size="sm" onClick={toggleLineType} leftIcon={<Icon as={lineType === 'monotone' ? ChartSpline : TrendingUp} boxSize={4} />} bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'} _hover={{ opacity: 0.8 }} borderRadius="md">
                            {lineType === 'monotone' ? 'Curvo' : 'Exato'}
                        </Button>
                        <IconButton aria-label="Tela Cheia" size="sm" icon={<Icon as={isFullscreen ? Minimize : Maximize} boxSize={4} />} onClick={toggleFullscreen} bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'} _hover={{ opacity: 0.8 }} borderRadius="md" />
                    </HStack>
                </Skeleton>
            </Flex>

            <Box flex={1} w="100%" minH={isFullscreen ? "70vh" : "300px"}>
                {loading ? (
                    <Skeleton isLoaded={!loading} w="100%" h="100%" borderRadius="xl" />
                ) : data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={CHART_MARGIN}>
                            <defs>
                                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={CYAN_GREEN} stopOpacity={0.5} />
                                    <stop offset="95%" stopColor={CYAN_GREEN} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? "#FFFFFF" : theme.textSecondary, fontSize: 12 }} dy={10} tickFormatter={chartFormatters.formatChartDate} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? "#FFFFFF" : theme.textSecondary, fontSize: 12 }} />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: isDarkMode ? '#1A202C' : '#FFFFFF', borderColor: theme.cardBorder, borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: theme.textPrimary }}
                                itemStyle={{ color: CYAN_GREEN, fontWeight: 'bold' }}
                                labelStyle={{ color: theme.textSecondary, marginBottom: '8px' }}
                                labelFormatter={chartFormatters.formatTooltipLabel}
                                formatter={chartFormatters.formatTooltipValue}
                            />
                            <Area type={lineType} dataKey="ticketCount" stroke={CYAN_GREEN} strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" activeDot={{ r: 6, fill: CYAN_GREEN, stroke: isDarkMode ? '#1A202C' : '#FFF', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <Flex h="100%" align="center" justify="center" direction="column" opacity={0.5}>
                        <TrendingUp size={48} color={theme.textSecondary} />
                        <Text mt={4} color={theme.textSecondary} fontWeight="bold">Nenhum dado no período selecionado</Text>
                    </Flex>
                )}
            </Box>
        </Box>
    );
};