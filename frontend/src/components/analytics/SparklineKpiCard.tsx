import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { CYAN_GREEN } from '../../constants/analytics/downtimeDashboardConstants';
import type { SparklineKpiCardProps } from '../../types';

export const SparklineKpiCard = React.memo(({
    label, value, sparklineData, dataKey, color = CYAN_GREEN
}: SparklineKpiCardProps) => {
    const theme = useMinimalTheme();
    const gradientId = `colorTicketsCarrossel_${label.replace(/\s+/g, '')}`;

    return (
        <Flex h="100%" w="200px" p={3} position="relative"
            flexDirection="column" justify="space-between" mx={2} flexShrink={0}>
            <Flex justify="space-between" align="baseline" w="100%" zIndex={2}>
                <Text fontSize="10px" fontWeight="bold" textTransform="uppercase"
                    letterSpacing="widest" color={theme.textSecondary} isTruncated>
                    {label}
                </Text>
            </Flex>
            <Text fontSize="2xl" fontWeight="black" color={theme.textPrimary}
                letterSpacing="tighter" zIndex={2} mb="10px">
                {value}
            </Text>
            <Box flex={1} w="100%" position="absolute" bottom="0" left="0"
                right="0" zIndex={1} opacity={0.6}>
                <ResponsiveContainer width="100%" height={30}>
                    <AreaChart data={sparklineData}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={1}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Flex>
    );
});

SparklineKpiCard.displayName = "SparklineKpiCard";