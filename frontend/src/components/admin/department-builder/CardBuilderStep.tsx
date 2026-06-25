import { Box, Flex, Heading, VStack, HStack, Input, Text, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { StaticIdCard } from '../../icons/StaticIcons';
import { IconSelectionModal } from './IconSelectionModal';
import { CardPreview } from './CardPreview';
import { InlineIconSelector } from './InlineIconSelector';
import { useCardBuilder } from '../../../hooks/admin/useCardBuilder';
import type { CardBuilderStepProps, AnimatedIconKey } from '../../../types';

export const CardBuilderStep = ({
    data, onChange,
    headerTitle = 'Construtor de Cards',
    entityNameLabel = 'Nome do Departamento',
    namePlaceholder = 'Ex: Suporte Técnico',
    descriptionPlaceholder = 'Ex: Solicite suporte para equipamentos...',
    showBadges = true,
    iconModalTitle = 'Selecione o ícone do departamento',
}: CardBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { isOpen: isIconModalOpen, onOpen: onOpenIconModal, onClose: onCloseIconModal } = useDisclosure();

    const { badges, selectedIcon: SelectedIcon } = useCardBuilder({ data, isDarkMode, onChange });

    const activeThemeColor = data.cardColorHex || (isDarkMode ? '#4299E1' : '#3182CE');
    const monochromeColor = useColorModeValue("black", "white");

    return (
        <Box mb={16} w="100%">
            <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: "auto", lg: "460px" }} w="100%">
                <Box flex={1} bg={theme.cardBg} p={5} borderRadius="xl" borderWidth="1px"
                    borderColor={theme.cardBorder} shadow="sm" h="100%" overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <Box color={theme.iconColor} display="flex"><StaticIdCard size={20} /></Box>
                        <Heading size="sm" color={theme.textPrimary}>{headerTitle}</Heading>
                    </HStack>
                    <VStack spacing={4} align="stretch">
                        <Box w="full">
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>{entityNameLabel}</Text>
                            <Input placeholder={namePlaceholder} value={data.name || ''}
                                onChange={(e) => onChange('name', e.target.value)}
                                bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                        </Box>
                        <Box w="full">
                            <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Descrição do Card</Text>
                            <Input placeholder={descriptionPlaceholder}
                                value={data.description || ''} onChange={(e) => onChange('description', e.target.value)}
                                bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                        </Box>
                        <SimpleGrid columns={2} gap={4}>
                            {showBadges && (
                                <Box w="full">
                                    <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Badges (Separar por vírgula)</Text>
                                    <Input placeholder="Ex: Sap, Sync" value={data.badgeInput || ''}
                                        onChange={(e) => onChange('badgeInput', e.target.value)}
                                        bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                </Box>
                            )}
                            <Box>
                                <Text fontSize="sm" fontWeight="bold" mb={1} color={theme.textSecondary}>Cor Tema do Card (HEX)</Text>
                                <HStack>
                                    <Input type="color" w="50px" p={1} cursor="pointer"
                                        value={data.cardColorHex || (isDarkMode ? '#4299E1' : '#3182CE')}
                                        onChange={(e) => onChange('cardColorHex', e.target.value)}
                                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                    <Input placeholder="#4299E1" value={data.cardColorHex || ''}
                                        onChange={(e) => onChange('cardColorHex', e.target.value)}
                                        bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                </HStack>
                            </Box>
                        </SimpleGrid>
                        <InlineIconSelector
                            selectedIconName={data.iconName}
                            cardBorder={theme.cardBorder}
                            bgApp={theme.bgApp}
                            textSecondary={theme.textSecondary}
                            isDarkMode={isDarkMode}
                            onSelect={(iconName) => onChange('iconName', iconName)}
                            onOpenModal={onOpenIconModal}
                        />
                    </VStack>
                </Box>

                <Flex flex={1} bg={theme.bgApp} p={5} borderRadius="xl" borderWidth="1px"
                    borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <HStack w="100%" mb={5} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <Box color={theme.iconColor} display="flex"><StaticIdCard size={20} /></Box>
                        <Heading size="sm" color={theme.textPrimary}>Live Constructor</Heading>
                    </HStack>
                    <Box flex={1} display="flex" alignItems="center" justifyContent="center" w="100%" position="relative">
                        <CardPreview
                            data={data}
                            badges={badges}
                            activeThemeColor={activeThemeColor}
                            monochromeColor={monochromeColor}
                            cardBg={theme.cardBg}
                            textSecondary={theme.textSecondary}
                            badgeBorder={theme.badgeBorder}
                            SelectedIcon={SelectedIcon}
                        />
                    </Box>
                </Flex>

                <IconSelectionModal
                    isOpen={isIconModalOpen}
                    onClose={onCloseIconModal}
                    onSelect={(iconName) => onChange('iconName', iconName as AnimatedIconKey)}
                    selectedIcon={data.iconName}
                    title={iconModalTitle}
                />
            </Flex>
        </Box>
    );
};