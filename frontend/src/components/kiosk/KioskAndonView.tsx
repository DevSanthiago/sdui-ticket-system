import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useHeatmapBoard } from "../../hooks/admin/useHeatmapBoard";
import { BoardCanvas } from "../admin/heatmap/BoardCanvas";

export const KioskAndonView = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { cards, loading } = useHeatmapBoard(isDarkMode);

    return (
        <Box h="100%" w="100%" bg={theme.bgApp} p={{ base: 4, md: 8 }} overflow="auto">
            {loading ? (
                <Flex justify="center" align="center" h="100%">
                    <Spinner color={theme.textPrimary} />
                </Flex>
            ) : (
                <BoardCanvas cards={cards} />
            )}
        </Box>
    );
};
