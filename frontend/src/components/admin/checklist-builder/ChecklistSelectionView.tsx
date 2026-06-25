import { useState, useEffect } from 'react';
import {
    Box, Flex, Heading, Text, SimpleGrid, HStack, VStack, Badge, IconButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { ActionCard } from '../../common/ActionCard';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import type { ChecklistSelectionViewProps, AnimatedIconKey } from '../../../types';

export const ChecklistSelectionView = ({
    filteredTemplates, loading, onSelectTemplate, onCreateNew
}: ChecklistSelectionViewProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
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
                <Box>
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
                            <AnimatedIcons.AnimatedFileCheck2 size={32} isHovered={isHeaderIconHovered} />
                        </Box>
                        <Heading size="lg" color={theme.textPrimary}>Construtor de Checklists</Heading>
                    </HStack>
                    <Text color={theme.textSecondary} fontSize="md" ml={12}>
                        Selecione um checklist existente para editar ou crie um novo dinamicamente.
                    </Text>
                </Box>
            </Box>

            <Box flex={1} overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }}
                pl={12} pr={2} pb={4} pt={4}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <ActionCard
                                key={i}
                                title=""
                                colorScheme=""
                                icon={AnimatedIcons.AnimatedFileCheck2}
                                onClick={() => { }}
                                isLoading
                            />
                        ))
                    ) : (
                        <>
                            {filteredTemplates.map(template => {
                                const iconKey = (template.iconName || 'AnimatedFileCheck2') as AnimatedIconKey;
                                const IconComponent = AnimatedIcons[iconKey] || AnimatedIcons.AnimatedFileCheck2;

                                return (
                                    <Box position="relative" key={template.id}>
                                        {!template.isActive && (
                                            <Badge position="absolute" top="-3" right="-3" zIndex={10}
                                                colorScheme="orange" variant="solid" borderRadius="full"
                                                px={3} py={1} boxShadow="md" border="2px solid"
                                                borderColor={theme.bgApp}>
                                                INATIVO
                                            </Badge>
                                        )}
                                        <ActionCard
                                            title={template.name}
                                            description={template.description}
                                            badges={template.schema?.badges ?? []}
                                            cardColorHex={template.cardColorHex}
                                            colorScheme={template.cardColorHex || 'blue'}
                                            icon={IconComponent}
                                            onClick={() => onSelectTemplate(template)}
                                        />
                                    </Box>
                                );
                            })}

                            <Flex
                                role="button"
                                tabIndex={0}
                                onClick={onCreateNew}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCreateNew(); }}
                                direction="column" align="center" justify="center" gap={3}
                                minH="150px" p={6} cursor="pointer"
                                bg="transparent" borderRadius="2xl"
                                borderWidth="2px" borderStyle="dashed" borderColor={theme.cardBorder}
                                color={theme.textSecondary}
                                transition="all 0.2s"
                                _hover={{ borderColor: isDarkMode ? 'white' : 'black', color: theme.textPrimary, transform: 'translateY(-4px)' }}>
                                <AnimatedIcons.AnimatedPlus size={28} />
                                <VStack spacing={0}>
                                    <Text fontWeight="bold">Criar Novo Checklist</Text>
                                    <Text fontSize="xs">Construa um checklist dinâmico</Text>
                                </VStack>
                            </Flex>
                        </>
                    )}
                </SimpleGrid>
            </Box>
        </Flex>
    );
};
