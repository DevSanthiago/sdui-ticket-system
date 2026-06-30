import { useState } from "react";
import { Box, Heading, SimpleGrid, VStack, Text, HStack, Skeleton, SkeletonCircle, IconButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useCockpitStats } from "../../hooks/admin/useCockpitStats";
import { CockpitStatCard } from "../../components/admin/cockpit/CockpitStatCard";
import { AdminActionCard } from "../../components/admin/cockpit/AdminActionCard";
import {
    AnimatedLayoutPanelTop, AnimatedRoute, AnimatedSettings,
    AnimatedAtom, AnimatedHammer, AnimatedChevronLeft, AnimatedFileCheck2, AnimatedFlame,
    AnimatedGalleryThumbnails, AnimatedClock, AnimatedCloudSync
} from "../../components/icons/NewAnimatedIcons";

export const CockpitAdminDashboard = () => {
    const navigate = useNavigate();
    const theme = useMinimalTheme();
    const [isBackHovered, setIsBackHovered] = useState(false);
    const { stats, loading } = useCockpitStats();

    return (
        <Box h="100%" display="flex" flexDirection="column" bg={theme.bgApp}>
            <VStack align="start" spacing={4} w="100%" h="100%" p={{ base: 4, md: 6 }} overflow="auto">
                <Box w="100%">
                    <HStack spacing={3} mb={2}>
                        <Skeleton isLoaded={!loading} borderRadius="md">
                            <IconButton
                                aria-label="Voltar para a Home"
                                icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                                onClick={() => navigate('/')}
                                variant="ghost" color={theme.textPrimary}
                                _hover={{ bg: theme.buttonHoverBg }}
                                onMouseEnter={() => setIsBackHovered(true)}
                                onMouseLeave={() => setIsBackHovered(false)}
                            />
                        </Skeleton>
                        <SkeletonCircle size="8" isLoaded={!loading}>
                            <Box color={theme.iconColor} display="flex"
                                alignItems="center" justifyContent="center">
                                <AnimatedLayoutPanelTop size={32} />
                            </Box>
                        </SkeletonCircle>
                        <Skeleton isLoaded={!loading} borderRadius="md">
                            <Heading size="lg" color={theme.textPrimary}>Cockpit Administrativo</Heading>
                        </Skeleton>
                    </HStack>
                    <Skeleton isLoaded={!loading} w="fit-content" borderRadius="md">
                        <Text color={theme.textSecondary} whiteSpace="nowrap">
                            Gerencie linhas de produção, prefixos de linhas e departamentos do Ticket System
                        </Text>
                    </Skeleton>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="100%">
                    <CockpitStatCard
                        label="Total de Linhas"
                        value={stats.totalLines}
                        helpText="Gerencie ou crie novas linhas de produção no Ticket System"
                        animatedIcon={<AnimatedRoute size={24} />}
                        actionLabel="Gerenciar Linhas"
                        onActionClick={() => navigate("/cockpit-admin/production-lines")}
                        loading={loading}
                    />
                    <CockpitStatCard
                        label="Prefixos Cadastrados"
                        value={stats.totalPrefixes}
                        helpText="Gerencie ou crie novos prefixos localizadores de linhas"
                        animatedIcon={<AnimatedSettings size={24} />}
                        actionLabel="Gerenciar Prefixos"
                        onActionClick={() => navigate("/cockpit-admin/prefixes")}
                        loading={loading}
                    />
                    <CockpitStatCard
                        label="Departamentos Ativos"
                        value={stats.totalDepartments}
                        helpText="Edite formulários e informações de departamentos já existentes no painel"
                        animatedIcon={<AnimatedHammer size={24} />}
                        actionLabel="Gerenciar Departamentos"
                        onActionClick={() => navigate("/cockpit-admin/department-editor")}
                        loading={loading}
                    />
                </SimpleGrid>

                <Box w="100%" mt={4}>
                    <Box mb={4}>
                        <Skeleton isLoaded={!loading} w="fit-content" mb={2} borderRadius="md">
                            <Heading size="md" color={theme.textPrimary} whiteSpace="nowrap">
                                Ações do Administrador
                            </Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!loading} w="fit-content" borderRadius="md">
                            <Text color={theme.textSecondary} fontSize="md">
                                Construa e edite departamentos através dos novos construtores dinâmicos do Ticket System
                            </Text>
                        </Skeleton>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
                        <AdminActionCard
                            title="Construtor de Departamentos"
                            description="Crie novos departamentos dinamicamente através do construtor do Ticket System."
                            animatedIcon={<AnimatedAtom size={24} />}
                            buttonText="Acessar Construtor"
                            onClick={() => navigate("/cockpit-admin/department-builder")}
                            loading={loading}
                        />
                        <AdminActionCard
                            title="Construtor de Checklists"
                            description="Crie novos checklists dinamicamente através do construtor do Ticket System"
                            animatedIcon={<AnimatedFileCheck2 size={24} />}
                            buttonText="Acessar Construtor"
                            onClick={() => navigate("/cockpit-admin/checklist-builder")}
                            loading={loading}
                        />
                    </SimpleGrid>
                </Box>

                <Box w="100%" mt={4}>
                    <Box mb={4}>
                        <Skeleton isLoaded={!loading} w="fit-content" mb={2} borderRadius="md">
                            <Heading size="md" color={theme.textPrimary} whiteSpace="nowrap">
                                Analytics
                            </Heading>
                        </Skeleton>
                        <Skeleton isLoaded={!loading} w="fit-content" borderRadius="md">
                            <Text color={theme.textSecondary} fontSize="md">
                                Acompanhe os indicadores e o tempo real das operações do Ticket System
                            </Text>
                        </Skeleton>
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4}>
                        <AdminActionCard
                            title="Painel de Calor Andon das Linhas"
                            description="Conecte linhas de produção e acompanhe os chamados em aberto por linha em tempo real."
                            animatedIcon={<AnimatedGalleryThumbnails size={24} />}
                            buttonText="Acessar Painel"
                            onClick={() => navigate("/cockpit-admin/heatmap-builder")}
                            loading={loading}
                        />
                        <AdminActionCard
                            title="Painel Heatmap das Linhas"
                            description="Visualize o heatmap das linhas de produção do Ticket System."
                            animatedIcon={<AnimatedFlame size={24} />}
                            buttonText="Acessar Painel"
                            onClick={() => navigate("/cockpit-admin/heatmap-lines")}
                            loading={loading}
                        />
                        <AdminActionCard
                            title="Downtime Live"
                            description="Acompanhe o tempo de linha parada das operações em tempo real."
                            animatedIcon={<AnimatedClock size={24} />}
                            buttonText="Acessar Painel"
                            onClick={() => navigate("/analytics/downtime-geral")}
                            loading={loading}
                        />
                        <AdminActionCard
                            title="Downtime Histórico"
                            description="Analise o histórico de downtime das linhas por período e departamento."
                            animatedIcon={<AnimatedCloudSync size={24} />}
                            buttonText="Acessar Painel"
                            onClick={() => navigate("/analytics/downtime-historico")}
                            loading={loading}
                        />
                    </SimpleGrid>
                </Box>
            </VStack>
        </Box>
    );
};