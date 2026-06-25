import { useCallback, useEffect, useRef, useState } from "react";
import {
    Box, Flex, Heading, Text, HStack, IconButton, Spinner, VStack,
    Tabs, TabList, Tab, TabIndicator
} from "@chakra-ui/react";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useLineHeatmap } from "../../hooks/admin/useLineHeatmap";
import { HeatmapTreemap } from "../../components/admin/heatmap/HeatmapTreemap";
import { HeatmapLegend } from "../../components/admin/heatmap/HeatmapLegend";
import { ConnectorManager } from "../../components/admin/heatmap/ConnectorManager";
import * as AnimatedIcons from "../../components/icons/NewAnimatedIcons";

export const LineHeatmapPanel = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();

    const [isBackHovered, setIsBackHovered] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const {
        mode, setMode,
        tiles, loading, now,
        connectors, prefixes, isSubmitting,
        addConnector, removeConnector,
    } = useLineHeatmap(isDarkMode);

    const isConnectors = mode === "connectors";

    useEffect(() => {
        const handler = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        } else {
            wrapperRef.current?.requestFullscreen().catch(() => { });
        }
    }, []);

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
                    <Heading size="lg" color={theme.textPrimary}>Painel Heatmap das Linhas</Heading>
                </HStack>
                <Text color={theme.textSecondary} fontSize="md" ml={14}>
                    Área de cada bloco pelo volume de tickets em aberto da linha; cor pelo tempo de
                    linha parada — verde a vermelho conforme a criticidade.
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

            {isConnectors ? (
                <Box flex={1} overflow="auto">
                    <ConnectorManager
                        connectors={connectors}
                        prefixes={prefixes}
                        isSubmitting={isSubmitting}
                        onAdd={addConnector}
                        onRemove={removeConnector}
                    />
                </Box>
            ) : (
                <Box ref={wrapperRef} position="relative" flex={1} bg={theme.bgApp}
                    borderWidth="1px" borderColor={theme.cardBorder} borderRadius="lg"
                    p={4} display="flex" flexDirection="column" overflow="hidden">
                    <IconButton
                        aria-label={isFullscreen ? "Sair da tela cheia" : "Expandir para tela cheia"}
                        icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
                        onClick={toggleFullscreen}
                        size="sm"
                        position="absolute"
                        top={3}
                        right={3}
                        zIndex={20}
                        bg={theme.cardBg}
                        color={theme.textPrimary}
                        borderWidth="1px"
                        borderColor={theme.cardBorder}
                        _hover={{ bg: theme.buttonHoverBg }}
                    />

                    {loading ? (
                        <Flex flex={1} justify="center" align="center">
                            <Spinner color={theme.textPrimary} />
                        </Flex>
                    ) : tiles.length === 0 ? (
                        <Flex flex={1} justify="center" align="center">
                            <VStack spacing={1} maxW="460px">
                                <Text color={theme.textSecondary} textAlign="center">
                                    Nenhuma linha conectada. Adicione um conector na aba “Conectores”
                                    para que as linhas apareçam no heatmap.
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
            )}
        </Flex>
    );
};
