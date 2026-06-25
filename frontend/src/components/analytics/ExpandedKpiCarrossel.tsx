import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SparklineKpiCard } from './SparklineKpiCard';
import { useExpandedKpiCarrossel } from '../../hooks/expanded-analytics/useExpandedKpiCarrossel';
import type { ExpandedKpiCarrosselProps } from '../../types';

export const ExpandedKpiCarrossel = React.memo(({ globalData, filters, color }: ExpandedKpiCarrosselProps) => {
    const { extendedKpiList } = useExpandedKpiCarrossel({ globalData, filters });

    return (
        <Box w="100%" position="absolute" top="80px" left="0" right="0"
            h="80px" overflow="hidden" zIndex={2000}>
            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "-50%" }}
                transition={{ ease: "linear", duration: 160, repeat: Infinity }}
                style={{
                    display: "flex", width: "max-content", height: "100%",
                    alignItems: "center", willChange: "transform", cursor: "default"
                }}
            >
                {extendedKpiList.map((kpi, index) => (
                    <SparklineKpiCard
                        key={`bloco1-${index}`}
                        label={kpi.label}
                        value={kpi.value}
                        sparklineData={kpi.series}
                        dataKey={kpi.dataKey}
                        color={color}
                    />
                ))}
                {extendedKpiList.map((kpi, index) => (
                    <SparklineKpiCard
                        key={`bloco2-${index}`}
                        label={kpi.label}
                        value={kpi.value}
                        sparklineData={kpi.series}
                        dataKey={kpi.dataKey}
                        color={color}
                    />
                ))}
            </motion.div>
        </Box>
    );
});

ExpandedKpiCarrossel.displayName = "ExpandedKpiCarrossel";