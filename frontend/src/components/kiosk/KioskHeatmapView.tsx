import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useLineHeatmap } from "../../hooks/admin/useLineHeatmap";
import { HeatmapTreemap } from "../admin/heatmap/HeatmapTreemap";
import { HeatmapLegend } from "../admin/heatmap/HeatmapLegend";

export const KioskHeatmapView = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { tiles, loading, now } = useLineHeatmap(isDarkMode);

    return (
        <Flex direction="column" h="100%" w="100%" bg={theme.bgApp}
            p={{ base: 4, md: 8 }} overflow="hidden">
            <Box flex={1} minH={0} display="flex" flexDirection="column"
                bg={theme.bgApp} borderWidth="1px" borderColor={theme.cardBorder}
                borderRadius="lg" p={4} overflow="hidden">
                {loading ? (
                    <Flex flex={1} justify="center" align="center">
                        <Spinner color={theme.textPrimary} />
                    </Flex>
                ) : tiles.length === 0 ? (
                    <Flex flex={1} justify="center" align="center">
                        <VStack spacing={1} maxW="460px">
                            <Text color={theme.textSecondary} textAlign="center">
                                Nenhuma linha conectada ao painel Heatmap. Configure os conectores no
                                Cockpit Administrativo para que as linhas apareçam aqui.
                            </Text>
                        </VStack>
                    </Flex>
                ) : (
                    <>
                        <Box flex={1} minH={0}>
                            <HeatmapTreemap tiles={tiles} now={now} />
                        </Box>
                        <Box pt={3} flexShrink={0}>
                            <HeatmapLegend />
                        </Box>
                    </>
                )}
            </Box>
        </Flex>
    );
};
