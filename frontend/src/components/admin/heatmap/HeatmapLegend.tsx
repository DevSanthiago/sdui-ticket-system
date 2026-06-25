import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import { heatColor, HEAT_KNEE_MINUTES, HEAT_MAX_MINUTES } from "../../../helpers/heatmapColor";

export const HeatmapLegend = () => {
    const theme = useMinimalTheme();
    const gradient = `linear-gradient(to right, ${heatColor(0)}, ${heatColor(HEAT_KNEE_MINUTES / 2)}, ${heatColor(HEAT_KNEE_MINUTES)}, ${heatColor(HEAT_MAX_MINUTES)})`;

    return (
        <VStack align="stretch" spacing={1} maxW="360px">
            <Box h="10px" borderRadius="full" style={{ background: gradient }} />
            <Flex justify="space-between">
                <Text fontSize="2xs" color={theme.textSecondary}>Sem parada</Text>
                <Text fontSize="2xs" color={theme.textSecondary}>{HEAT_KNEE_MINUTES}min</Text>
                <Text fontSize="2xs" color={theme.textSecondary}>{HEAT_MAX_MINUTES}min+</Text>
            </Flex>
        </VStack>
    );
};
