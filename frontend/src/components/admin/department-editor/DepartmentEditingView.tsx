import { useState, useEffect } from 'react';
import {
    Box, Flex, Heading, Text, VStack, HStack, Button, IconButton,
    Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator
} from '@chakra-ui/react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import { CardBuilderStep } from '../department-builder/CardBuilderStep';
import { FormBuilderStep } from '../department-builder/FormBuilderStep';
import { RolesBuilderStep } from '../department-builder/RolesBuilderStep';
import { SummaryBuilderStep } from '../department-builder/SummaryBuilderStep';
import type { DepartmentEditingViewProps, AnimatedIconKey, DepartmentEditData } from '../../../types';

export const DepartmentEditingView = ({
    editData, editFields, isSaving,
    onEditDataChange, onFieldsChange,
    onToggleStatus, onSave, onBack
}: DepartmentEditingViewProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const [isHeaderIconHovered, setIsHeaderIconHovered] = useState(true);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isSaveHovered, setIsSaveHovered] = useState(false);
    const [isToggleStatusHovered, setIsToggleStatusHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsHeaderIconHovered(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    const editingIconKey = editData.iconName as AnimatedIconKey;
    const DynamicEditingIcon = AnimatedIcons[editingIconKey] || AnimatedIcons.AnimatedBox;

    return (
        <Flex direction="column" bg={theme.bgApp} w="100%" h="100%"
            p={{ base: 4, md: 8 }} overflow="hidden">
            <Box mb={6} flexShrink={0}>
                <Flex justify="space-between" align="center" mb={2} flexWrap="wrap" gap={4}>
                    <HStack spacing={4}>
                        <IconButton
                            aria-label="Voltar à Vitrine"
                            icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isBackHovered} />}
                            onClick={onBack}
                            variant="ghost" color={theme.textPrimary}
                            _hover={{ bg: theme.buttonHoverBg }}
                            onMouseEnter={() => setIsBackHovered(true)}
                            onMouseLeave={() => setIsBackHovered(false)}
                        />
                        <Box color={theme.iconColor} display="flex"
                            alignItems="center" justifyContent="center"
                            onMouseEnter={() => setIsHeaderIconHovered(true)}
                            onMouseLeave={() => setIsHeaderIconHovered(false)}>
                            <DynamicEditingIcon size={32} isHovered={isHeaderIconHovered} />
                        </Box>
                        <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={theme.textSecondary} fontWeight="bold"
                                textTransform="uppercase" letterSpacing="wider">
                                Modo de Edição
                            </Text>
                            <Heading size="lg" color={theme.textPrimary}>
                                {editData.name || 'Sem Nome'}
                            </Heading>
                        </VStack>
                    </HStack>
                </Flex>
                <Text color={theme.textSecondary} fontSize="md" ml={14}>
                    No modo de edição de departamentos você pode editar dinamicamente cards, forms, permissões e status.
                </Text>
            </Box>

            <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
                <Tabs variant="unstyled" display="flex" flexDirection="column" h="100%">
                    <Flex justify="center" mb={6} py={6} flexShrink={0}>
                        <TabList position="relative" bg={theme.cardBg} p={1.5}
                            borderRadius="full" borderWidth="1px" borderColor={theme.cardBorder}
                            boxShadow="sm" display="inline-flex">
                            {['Identidade Visual', 'Formulário Dinâmico', 'Permissões de Acesso', 'Mapeamento de Resumo'].map((label) => (
                                <Tab key={label} borderRadius="full" px={6} py={2}
                                    fontSize="sm" fontWeight="bold" color={theme.textSecondary} zIndex={2}
                                    _selected={{ color: isDarkMode ? 'black' : 'white' }}
                                    transition="color 0.3s">
                                    {label}
                                </Tab>
                            ))}
                            <Tab borderRadius="full" px={6} py={2} fontSize="sm" fontWeight="bold" zIndex={2}
                                color={editData.isActive ? "orange.500" : "green.500"}
                                _selected={{ color: editData.isActive ? "orange.600" : "green.600" }}
                                transition="color 0.3s">
                                Status do Departamento
                            </Tab>
                            <TabIndicator position="absolute" top="6px" height="calc(100% - 12px)"
                                bg={isDarkMode ? 'white' : 'black'} borderRadius="full"
                                boxShadow={isDarkMode ? theme.toggleActiveShadow : 'md'} zIndex={1}
                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important" />
                        </TabList>
                    </Flex>

                    <TabPanels flex={1} display="flex" flexDirection="column" overflow="hidden">
                        <TabPanel p={0} h="100%">
                            <CardBuilderStep
                                data={{
                                    name: editData.name,
                                    description: editData.description,
                                    iconName: editData.iconName,
                                    badgeInput: editData.badgeInput,
                                    cardColorHex: editData.cardColorHex
                                }}
                                onChange={(field, value) => {
                                    const key = field as keyof DepartmentEditData;
                                    onEditDataChange(key, value as DepartmentEditData[typeof key]);
                                }}
                            />
                        </TabPanel>

                        <TabPanel p={0} h="100%">
                            <FormBuilderStep fields={editFields} onChange={onFieldsChange}
                                departmentName={editData.name} />
                        </TabPanel>

                        <TabPanel p={0} h="100%">
                            <RolesBuilderStep
                                allowedRoles={editData.allowedRoles}
                                onChange={(roles) => onEditDataChange('allowedRoles', roles)}
                            />
                        </TabPanel>

                        <TabPanel p={0} h="100%">
                            <SummaryBuilderStep
                                fields={editFields}
                                summaryFields={editData.summaryFields}
                                onChange={(ids) => onEditDataChange('summaryFields', ids)}
                                departmentConfig={editData}
                            />
                        </TabPanel>

                        <TabPanel p={0} h="100%">
                            <Flex justify="center" pt={10}>
                                <Box w="100%" maxW="600px" borderWidth="1px"
                                    borderColor={editData.isActive ? "orange.500" : "green.500"}
                                    borderRadius="2xl" p={8} transition="all 0.3s ease"
                                    bg={isDarkMode
                                        ? (editData.isActive ? "rgba(221, 107, 32, 0.05)" : "rgba(56, 161, 105, 0.05)")
                                        : (editData.isActive ? "orange.50" : "green.50")}
                                    _hover={{
                                        boxShadow: editData.isActive ? "0 0 20px rgba(221, 107, 32, 0.4)" : "none",
                                    }}
                                    sx={{
                                        '&:has(button:hover)': {
                                            boxShadow: editData.isActive ? "0 0 25px rgba(221, 107, 32, 0.6)" : "none",
                                        }
                                    }}>
                                    <Heading size="md" mb={3}
                                        color={editData.isActive ? "orange.500" : "green.500"}>
                                        {editData.isActive ? "Desativar Departamento" : "Reativar Departamento"}
                                    </Heading>
                                    <Text mb={8} color={theme.textPrimary} lineHeight="tall">
                                        {editData.isActive
                                            ? "Ao desativar este departamento, ele deixará de aparecer no Painel de Ações para os usuários abrirem chamados. O histórico de tickets já abertos permanecerá intacto."
                                            : "Este departamento está atualmente inativo. Ao reativá-lo, ele voltará a ficar visível e disponível para os usuários no Painel de Ações."}
                                    </Text>
                                    <Button
                                        colorScheme={editData.isActive ? "orange" : "green"}
                                        variant="solid" onClick={onToggleStatus}
                                        size="lg" w="100%" borderRadius="xl"
                                        transition="all 0.2s ease"
                                        onMouseEnter={() => setIsToggleStatusHovered(true)}
                                        onMouseLeave={() => setIsToggleStatusHovered(false)}
                                        leftIcon={editData.isActive
                                            ? <AnimatedIcons.AnimatedPause size={20} isHovered={isToggleStatusHovered} />
                                            : undefined}
                                        _hover={{
                                            boxShadow: editData.isActive ? "0 4px 12px rgba(221, 107, 32, 0.3)" : "none"
                                        }}>
                                        {editData.isActive ? "Desativar Departamento" : "Reativar Departamento"}
                                    </Button>
                                </Box>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            <Button
                mt={6} w="100%" size="lg" h="50px" borderRadius="xl"
                bg={isDarkMode ? "white" : "black"}
                color={isDarkMode ? "black" : "white"}
                _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                leftIcon={<AnimatedIcons.AnimatedRocket size={20} isHovered={isSaveHovered} />}
                onClick={onSave} isLoading={isSaving}
                onMouseEnter={() => setIsSaveHovered(true)}
                onMouseLeave={() => setIsSaveHovered(false)}
                fontSize="lg" fontWeight="bold" shadow="md" flexShrink={0}>
                Salvar Alterações
            </Button>
        </Flex>
    );
};