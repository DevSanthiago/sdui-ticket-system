import { useState } from "react";
import { Box, Flex, Heading, Text, HStack, IconButton, Spinner, VStack, Tabs, TabList, Tab, TabIndicator } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useHeatmapBoard } from "../../hooks/admin/useHeatmapBoard";
import { BoardCanvas } from "../../components/admin/heatmap/BoardCanvas";
import { ConnectorManager } from "../../components/admin/heatmap/ConnectorManager";
import * as AnimatedIcons from "../../components/icons/NewAnimatedIcons";

export const HeatmapBuilder = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();

    const [isBackHovered, setIsBackHovered] = useState(false);

    const {
        mode, setMode,
        loading, isSubmitting,
        connectors, cards, prefixes,
        addConnector, removeConnector,
    } = useHeatmapBoard(isDarkMode);

    const isConnectors = mode === "connectors";

    return (
        <Flex direction="column" bg={theme.bgApp} w="100%" h="100%"
            p={{ base: 4, md: 8 }} overflow="hidden">
            <Box mb={6} flexShrink={0}>
                <HStack spacing={4} mb={2}>
                    <IconButton
                        aria-label="Voltar ao Cockpit"
                        icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />}
                        onClick={() => navigate('/cockpit-admin')}
                        variant="ghost" color={theme.textPrimary}
                        _hover={{ bg: theme.buttonHoverBg }}
                        onMouseEnter={() => setIsBackHovered(true)}
                        onMouseLeave={() => setIsBackHovered(false)}
                    />
                    <Box color={theme.iconColor} display="flex" alignItems="center">
                        <AnimatedIcons.AnimatedFlame size={32} isHovered />
                    </Box>
                    <Heading size="lg" color={theme.textPrimary}>Painel de Calor Andon das Linhas</Heading>
                </HStack>
                <Text color={theme.textSecondary} fontSize="md" ml={14}>
                    Conecte fontes de linhas de produção e acompanhe, em tempo real, o volume de
                    chamados em aberto por linha — verde a vermelho conforme a criticidade.
                </Text>
            </Box>

            <Flex flexShrink={0} mb={6} justify="center" py={1}>
                <Tabs variant="unstyled" index={isConnectors ? 1 : 0}
                    onChange={(i) => setMode(i === 0 ? "heatmap" : "connectors")}>
                    <TabList position="relative" bg={theme.bgApp} p={1.5}
                        borderRadius="full" borderWidth="1px" borderColor={theme.cardBorder}
                        display="inline-flex">
                        <Tab borderRadius="full" px={6} py={2} fontSize="sm" fontWeight="bold"
                            color={theme.textSecondary} zIndex={2} whiteSpace="nowrap" transition="color 0.3s"
                            _selected={{ color: isDarkMode ? 'black' : 'white' }}>
                            Mapa de Calor
                        </Tab>
                        <Tab borderRadius="full" px={6} py={2} fontSize="sm" fontWeight="bold"
                            color={theme.textSecondary} zIndex={2} whiteSpace="nowrap" transition="color 0.3s"
                            _selected={{ color: isDarkMode ? 'black' : 'white' }}>
                            Conectores
                        </Tab>
                        <TabIndicator position="absolute" top="6px" height="calc(100% - 12px)"
                            bg={isDarkMode ? 'white' : 'black'} borderRadius="full"
                            boxShadow={isDarkMode ? theme.toggleActiveShadow : 'md'} zIndex={1}
                            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important" />
                    </TabList>
                </Tabs>
            </Flex>

            <Box flex={1} overflow="auto">
                {loading ? (
                    <Flex justify="center" align="center" h="100%">
                        <Spinner color={theme.textPrimary} />
                    </Flex>
                ) : isConnectors ? (
                    <VStack align="stretch" spacing={4}>
                        <ConnectorManager
                            connectors={connectors}
                            prefixes={prefixes}
                            isSubmitting={isSubmitting}
                            onAdd={addConnector}
                            onRemove={removeConnector}
                        />
                        <BoardCanvas cards={cards} />
                    </VStack>
                ) : (
                    <BoardCanvas cards={cards} />
                )}
            </Box>
        </Flex>
    );
};
