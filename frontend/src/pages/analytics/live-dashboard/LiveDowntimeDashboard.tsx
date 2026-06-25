import { Box, Flex, Heading, Text, SimpleGrid, HStack, VStack, Skeleton, SkeletonCircle, Button, Menu, MenuButton, MenuList, MenuItem, Icon, IconButton, Divider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, RefreshCcw } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { AnimatedClock, AnimatedChevronLeft, AnimatedFlame, AnimatedLayers, AnimatedTimer, AnimatedFactory } from '../../../components/icons/NewAnimatedIcons';
import { CYAN_GREEN } from '../../../constants/analytics/downtimeDashboardConstants';

import { useLiveDowntimeDashboard } from '../../../hooks/analytics/useLiveDowntimeDashboard';
import { StatCard } from '../../../components/analytics/StatCard';
import { ExpandedKpiCarrossel } from '../../../components/analytics/ExpandedKpiCarrossel';
import { LiveVolumeChart } from '../../../components/analytics/live/LiveVolumeChart';
import { LiveDepartmentPerformanceTable } from '../../../components/analytics/live/LiveDepartmentPerformanceTable';

export const LiveDowntimeDashboard = () => {
    const navigate = useNavigate();
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const {
        data, loading, isBackHovered, setIsBackHovered, departments, departmentId, setDepartmentId,
        lineType, toggleLineType, currentShiftLabel, containerRef, isFullscreen, toggleFullscreen,
        carrosselFilters, fetchMetrics, chartFormatters
    } = useLiveDowntimeDashboard();

    return (
        <Box h="100%" bg={theme.bgApp} p={{ base: 4, md: 8 }} overflowY="auto">
            <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
                <HStack spacing={4}>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <IconButton
                            aria-label="Voltar para a Home" icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                            onClick={() => navigate('/')} variant="ghost" color={theme.textPrimary}
                            _hover={{ bg: theme.buttonHoverBg }}
                            onMouseEnter={() => setIsBackHovered(true)} onMouseLeave={() => setIsBackHovered(false)}
                        />
                    </Skeleton>
                    <SkeletonCircle size="10" isLoaded={!loading}>
                        <Box color={isDarkMode ? "white" : "black"}>
                            <AnimatedClock size={40} isHovered={!loading} />
                        </Box>
                    </SkeletonCircle>
                    <VStack align="start" spacing={0}>
                        <Skeleton isLoaded={!loading} borderRadius="md">
                            <Heading size="lg" color={theme.textPrimary}>Downtime Live</Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!loading} borderRadius="md" mt={1}>
                            <Text color={theme.textSecondary} fontSize="sm">Monitoramento de performance do atendimento em tempo real</Text>
                        </Skeleton>
                    </VStack>
                </HStack>

                <Skeleton isLoaded={!loading} borderRadius="2xl">
                    <HStack spacing={1} bg={isDarkMode ? "#000000" : "white"} p={2} borderRadius="2xl" borderWidth="1px" borderColor={theme.cardBorder}>
                        <HStack px={3} spacing={2}>
                            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                <Box w="8px" h="8px" borderRadius="full" bg={CYAN_GREEN} />
                            </motion.div>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textPrimary} letterSpacing="wider">
                                {currentShiftLabel}
                            </Text>
                        </HStack>
                        <Divider orientation="vertical" h="20px" borderColor={theme.cardBorder} mx={1} />
                        <HStack px={2} borderRightWidth="1px" borderColor={theme.cardBorder}>
                            <Icon as={Filter} boxSize={4} color={theme.iconColor} />
                            <Menu matchWidth>
                                <MenuButton as={Button} variant="unstyled" rightIcon={<Icon as={ChevronDown} boxSize={4} />} w={{ base: "140px", md: "180px" }} textAlign="left" fontWeight="normal" color={theme.textPrimary} display="flex" alignItems="center" _hover={{ opacity: 0.8 }}>
                                    <Text isTruncated fontSize="sm" mt="2px">
                                        {departmentId === '' ? 'Downtime por departamento' : departments.find(d => d.id.toString() === departmentId)?.name || 'Todos os Deptos'}
                                    </Text>
                                </MenuButton>
                                <MenuList bg={isDarkMode ? "#000000" : "white"} borderColor={isDarkMode ? "whiteAlpha.200" : "gray.200"} boxShadow="xl" py={2} zIndex={100}>
                                    <MenuItem bg="transparent" color={theme.textPrimary} _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }} onClick={() => setDepartmentId('')} fontSize="sm">
                                        Downtime por departamento
                                    </MenuItem>
                                    {departments.map(dept => (
                                        <MenuItem key={dept.id} bg="transparent" color={theme.textPrimary} _hover={{ bg: isDarkMode ? "whiteAlpha.100" : "gray.50" }} onClick={() => setDepartmentId(dept.id.toString())} fontSize="sm">
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </HStack>
                        <Button size="sm" ml={2} leftIcon={<Icon as={RefreshCcw} boxSize={4} />} onClick={fetchMetrics} isLoading={loading} bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'} _hover={{ opacity: 0.8 }} borderRadius="xl">
                            Atualizar
                        </Button>
                    </HStack>
                </Skeleton>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6} mb={8}>
                <StatCard label="Total de Tickets" value={data?.globalAnalytics.totalTickets ?? 0} animatedIcon={<AnimatedLayers />} loading={loading} helpText="Volume no período selecionado" />
                <StatCard label="Tickets Em Aberto" value={data?.globalAnalytics.openTickets ?? 0} animatedIcon={<AnimatedFlame />} loading={loading} helpText="Chamados aguardando atendimento" />
                <StatCard label="Tempo de Resposta" value={`${data?.globalAnalytics.averageResponseTimeMinutes.toFixed(1) ?? 0} min`} animatedIcon={<AnimatedTimer />} loading={loading} helpText="Média (Abertura → Aceite) MTTA" />
                <StatCard label="Tempo Atendimento" value={`${data?.globalAnalytics.averageResolutionTimeMinutes.toFixed(1) ?? 0} min`} animatedIcon={<AnimatedClock />} loading={loading} helpText="Média (Aceite → Conclusão) MTTR" />
                <StatCard label="Impacto Produtivo" value={`${data?.globalAnalytics.totalDowntimeHours.toFixed(1) ?? 0} hrs`} animatedIcon={<AnimatedFactory />} loading={loading} helpText="Total de Linha Parada" />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
                {isFullscreen && (
                    <ExpandedKpiCarrossel globalData={data} filters={carrosselFilters} />
                )}

                <LiveVolumeChart
                    data={data?.timeSeriesAnalytics} loading={loading}
                    containerRef={containerRef} isFullscreen={isFullscreen} toggleFullscreen={toggleFullscreen}
                    lineType={lineType} toggleLineType={toggleLineType} chartFormatters={chartFormatters}
                />

                <LiveDepartmentPerformanceTable
                    departmentsData={data?.departmentAnalytics} loading={loading}
                />
            </SimpleGrid>
        </Box>
    );
};