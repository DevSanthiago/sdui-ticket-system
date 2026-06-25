import { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Skeleton, Flex, Heading, Button, VStack } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { api } from '../../services/api/api';
import { ActionCard } from '../../components/common/ActionCard';
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { Alert } from '../../services/alerts/alertService';
import { usePendingChecklist } from '../../hooks/checklist/usePendingChecklist';
import type { Department } from '../../types';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';

export const ActionsPanel = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [headerAnim, setHeaderAnim] = useState(false);
    const navigate = useNavigate();
    const theme = useMinimalTheme();
    const { hasPending } = usePendingChecklist();

    const orangeNeon = useColorModeValue("#C05621", "#ED8936");
    const emptyBtnBg = useColorModeValue("black", "white");
    const emptyBtnColor = useColorModeValue("white", "black");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/actions-panel');
                setDepartments(response.data);
            } catch (error) {
                console.error('Erro ao buscar painéis:', error);
                Alert.error('Erro', 'Não foi possível carregar o painel de ações.');
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const t1 = setTimeout(() => setHeaderAnim(true), 150);
        const t2 = setTimeout(() => setHeaderAnim(false), 1100);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [isLoading]);

    const handleCardClick = (departmentId: number) => {
        if (hasPending) {
            Alert.warning(
                'Checklist pendente',
                'Você precisa preencher o checklist pendente na Caixa de Entrada antes de abrir um novo ticket.'
            );
            navigate('/checklists');
            return;
        }
        navigate(`/actions/${departmentId}/new`);
    };

    return (
        <Box p={{ base: 4, md: 8 }} w="full">
            <Box mb={8}>
                {isLoading ? (
                    <VStack align="start" spacing={2}>
                        <Skeleton height="32px" width="220px" borderRadius="xl" />
                        <Skeleton height="18px" width="420px" maxW="80%" borderRadius="md" />
                    </VStack>
                ) : (
                    <>
                        <Flex align="center" gap={3} mb={2}>
                            <Box color={theme.iconColor} display="flex" alignItems="center" justifyContent="center">
                                <AnimatedIcons.AnimatedPanelLeftClose size={30} isHovered={headerAnim} />
                            </Box>
                            <Heading size="lg" color={theme.textPrimary}>Painel de Ações</Heading>
                        </Flex>
                        <Text color={theme.textSecondary}>
                            Bem-vindo(a) ao Ticket System, navegue entre os departamentos e solicite tickets para suporte da sua linha
                        </Text>
                    </>
                )}
            </Box>

            {!isLoading && hasPending && (
                <Flex mb={6} p={4} borderRadius="xl" borderWidth="1px" borderColor={orangeNeon}
                    bg="transparent" boxShadow={`0 0 10px ${orangeNeon}88, inset 0 0 10px ${orangeNeon}55`}
                    align="center" justify="space-between" gap={4}
                    direction={{ base: 'column', md: 'row' }}>
                    <Flex align="center" gap={3}>
                        <Box color={orangeNeon} display="flex" alignItems="center" pointerEvents="none">
                            <AnimatedIcons.AnimatedBadgeAlert size={22} loop />
                        </Box>
                        <Text color={orangeNeon} fontWeight="medium">
                            Você possui um checklist pendente. Conclua-o para voltar a abrir tickets.
                        </Text>
                    </Flex>
                    <Button
                        size="sm" variant="outline" flexShrink={0}
                        bg="transparent" color={theme.textSecondary}
                        borderColor={theme.cardBorder}
                        onClick={() => navigate('/checklists')}
                        transition="all 0.2s"
                        _hover={{
                            color: orangeNeon,
                            borderColor: orangeNeon,
                            boxShadow: `0 0 10px ${orangeNeon}88, inset 0 0 10px ${orangeNeon}55`,
                        }}
                    >
                        Ir para a Caixa de Entrada
                    </Button>
                </Flex>
            )}

            {isLoading ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {[...Array(8)].map((_, index) => (
                        <ActionCard
                            key={index}
                            title=""
                            colorScheme=""
                            icon={AnimatedIcons.AnimatedBox}
                            onClick={() => { }}
                            isLoading
                        />
                    ))}
                </SimpleGrid>
            ) : departments.length === 0 ? (
                <Box
                    as={RouterLink}
                    to="/cockpit-admin"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    p={10}
                    borderRadius="xl"
                    bg={emptyBtnBg}
                    color={emptyBtnColor}
                    fontWeight="bold"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{ boxShadow: theme.toggleActiveShadow, transform: 'translateY(-2px)' }}
                >
                    Nenhum departamento configurado. Acesse o Cockpit Admin para criar um.
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {departments.map((dept) => {
                        const iconKey = (dept.iconName || 'AnimatedBox') as keyof typeof AnimatedIcons;
                        const IconComponent = AnimatedIcons[iconKey] || AnimatedIcons.AnimatedBox;

                        return (
                            <ActionCard
                                key={dept.id}
                                title={dept.name}
                                description={dept.description}
                                badges={dept.badges}
                                cardColorHex={dept.cardColorHex}
                                icon={IconComponent}
                                onClick={() => handleCardClick(dept.id)}
                                colorScheme={dept.formSchema?.theme || "blue"}
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </Box>
    );
};