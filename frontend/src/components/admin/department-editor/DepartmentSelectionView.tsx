import { useState, useEffect } from 'react';
import {
    Box, Flex, Heading, Text, SimpleGrid,
    HStack, Skeleton, SkeletonCircle, SkeletonText,
    Badge, IconButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { ActionCard } from '../../common/ActionCard';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import type { DepartmentSelectionViewProps, AnimatedIconKey } from '../../../types';

export const DepartmentSelectionView = ({
    filteredDepartments, loading, onSelectDepartment
}: DepartmentSelectionViewProps) => {
    const theme = useMinimalTheme();
    const navigate = useNavigate();

    const [isHeaderIconHovered, setIsHeaderIconHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => setIsHeaderIconHovered(true), 50);
        const stopTimer = setTimeout(() => setIsHeaderIconHovered(false), 1550);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(stopTimer);
        };
    }, []);

    return (
        <Flex direction="column" bg={theme.bgApp} w="100%" h="100%"
            p={{ base: 4, md: 8 }} overflow="hidden">
            <Box mb={4} flexShrink={0}>
                <HStack spacing={4} mb={2}>
                    <IconButton
                        aria-label="Voltar"
                        icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />}
                        onClick={() => navigate('/cockpit-admin')}
                        variant="ghost" color={theme.textPrimary}
                        _hover={{ bg: theme.buttonHoverBg }}
                        onMouseEnter={() => setIsBackHovered(true)}
                        onMouseLeave={() => setIsBackHovered(false)}
                    />
                    <Box color={theme.iconColor} display="flex"
                        alignItems="center" justifyContent="center"
                        onMouseEnter={() => setIsHeaderIconHovered(true)}
                        onMouseLeave={() => setIsHeaderIconHovered(false)}>
                        <AnimatedIcons.AnimatedHammer size={32} isHovered={isHeaderIconHovered} />
                    </Box>
                    <Heading size="lg" color={theme.textPrimary}>Editor de Departamentos</Heading>
                </HStack>
                <Text color={theme.textSecondary} fontSize="md" ml={12}>
                    Selecione um departamento existente no sistema para modificar sua identidade ou formulário.
                </Text>
            </Box>

            <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }}
                pl={12} pr={2} pb={4} pt={4}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Box key={i} p={6} h="150px" bg={theme.cardBg}
                                borderRadius="2xl" borderWidth="1px" borderColor={theme.cardBorder}>
                                <HStack mb={4}>
                                    <SkeletonCircle size="12" borderRadius="xl" />
                                    <Skeleton height="20px" width="150px" />
                                </HStack>
                                <SkeletonText mt={4} noOfLines={2} spacing="2" skeletonHeight="2" />
                            </Box>
                        ))
                    ) : filteredDepartments.length > 0 ? (
                        filteredDepartments.map(dept => {
                            const iconKey = (dept.iconName || 'AnimatedBox') as AnimatedIconKey;
                            const IconComponent = AnimatedIcons[iconKey] || AnimatedIcons.AnimatedBox;

                            return (
                                <Box position="relative" key={dept.id}>
                                    {!dept.isActive && (
                                        <Badge position="absolute" top="-3" right="-3" zIndex={10}
                                            colorScheme="orange" variant="solid" borderRadius="full"
                                            px={3} py={1} boxShadow="md" border="2px solid"
                                            borderColor={theme.bgApp}>
                                            INATIVO
                                        </Badge>
                                    )}
                                    <ActionCard
                                        title={dept.name}
                                        description={dept.description}
                                        badges={dept.badges}
                                        cardColorHex={dept.cardColorHex}
                                        colorScheme={dept.cardColorHex || "blue"}
                                        icon={IconComponent}
                                        onClick={() => onSelectDepartment(dept)}
                                    />
                                </Box>
                            );
                        })
                    ) : (
                        <Flex direction="column" align="center" justify="center" p={10} gridColumn="1 / -1">
                            <Text color={theme.textSecondary} fontSize="lg">
                                Nenhum departamento encontrado.
                            </Text>
                        </Flex>
                    )}
                </SimpleGrid>
            </Box>
        </Flex>
    );
};