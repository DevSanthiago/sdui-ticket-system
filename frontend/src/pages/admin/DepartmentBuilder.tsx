import { useState, useEffect } from 'react';
import { Box, Flex, Heading, HStack, Text, Button, IconButton } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useDepartmentBuilder } from '../../hooks/admin/useDepartmentBuilder';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { CardBuilderStep } from '../../components/admin/department-builder/CardBuilderStep';
import { FormBuilderStep } from '../../components/admin/department-builder/FormBuilderStep';
import { RolesBuilderStep } from '../../components/admin/department-builder/RolesBuilderStep';
import { SummaryBuilderStep } from '../../components/admin/department-builder/SummaryBuilderStep';

export const DepartmentBuilder = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const [isNextHovered, setIsNextHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);
    const [isSaveHovered, setIsSaveHovered] = useState(false);
    const [isHeaderIconAnimating, setIsHeaderIconAnimating] = useState(true);
    const [isHeaderBackHovered, setIsHeaderBackHovered] = useState(false);

    const {
        currentStep, setCurrentStep,
        isSaving,
        departmentData,
        formFields, setFormFields,
        handleDepartmentDataChange,
        handleNextStep,
        handleBackStep,
        handleSave,
    } = useDepartmentBuilder(isDarkMode);

    useEffect(() => {
        const timer = setTimeout(() => setIsHeaderIconAnimating(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Flex direction="column" bg={theme.bgApp} w="100%" h="100%"
            p={{ base: 4, md: 8 }} overflow="hidden">
            <Box mb={10} flexShrink={0}>
                <HStack spacing={4} mb={2}>
                    <IconButton
                        aria-label="Voltar para a etapa anterior"
                        icon={<AnimatedIcons.AnimatedChevronLeft isHovered={isHeaderBackHovered} />}
                        onClick={handleBackStep}
                        variant="ghost" color={theme.textPrimary}
                        _hover={{ bg: theme.buttonHoverBg }}
                        onMouseEnter={() => setIsHeaderBackHovered(true)}
                        onMouseLeave={() => setIsHeaderBackHovered(false)}
                    />
                    <Box color={theme.iconColor} display="flex"
                        onMouseEnter={() => setIsHeaderIconAnimating(true)}
                        onMouseLeave={() => setIsHeaderIconAnimating(false)}>
                        <AnimatedIcons.AnimatedAtom size={32} isHovered={isHeaderIconAnimating} />
                    </Box>
                    <Heading size="lg" color={theme.textPrimary}>Criar Departamento</Heading>
                </HStack>
                <Text color={theme.textSecondary} fontSize="md" ml={14}>
                    Crie e gerencie departamentos completos com o construtor do Ticket System
                </Text>
            </Box>

            <Flex flex={1} direction="column" maxW="1200px" mx="auto" w="100%" overflow="hidden">
                <Box flex={1} w="100%" overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }} pb={4}>
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <CardBuilderStep data={departmentData} onChange={handleDepartmentDataChange} />
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <FormBuilderStep fields={formFields} onChange={setFormFields}
                                    departmentName={departmentData.name} />
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <RolesBuilderStep
                                    allowedRoles={departmentData.allowedRoles}
                                    onChange={(roles) => handleDepartmentDataChange('allowedRoles', roles)}
                                />
                            </motion.div>
                        )}
                        {currentStep === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <SummaryBuilderStep
                                    fields={formFields}
                                    summaryFields={departmentData.summaryFields}
                                    onChange={(ids) => handleDepartmentDataChange('summaryFields', ids)}
                                    departmentConfig={departmentData}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                <Box mt={4} w="100%" flexShrink={0}>
                    {currentStep < 4 ? (
                        <HStack w="100%" spacing={4}>
                            {currentStep > 1 && (
                                <Button
                                    size="lg" h="50px" flex={1} variant="outline"
                                    borderColor={theme.cardBorder}
                                    leftIcon={<AnimatedIcons.AnimatedChevronLeft size={20} isHovered={isBackHovered} />}
                                    onClick={handleBackStep}
                                    onMouseEnter={() => setIsBackHovered(true)}
                                    onMouseLeave={() => setIsBackHovered(false)}
                                    color={theme.textPrimary} _hover={{ bg: theme.buttonBg }}
                                >
                                    Voltar
                                </Button>
                            )}
                            <Button
                                size="lg" h="50px" flex={2}
                                bg={isDarkMode ? "white" : "black"}
                                color={isDarkMode ? "black" : "white"}
                                _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                                rightIcon={<AnimatedIcons.AnimatedChevronRight size={20} isHovered={isNextHovered} />}
                                onClick={handleNextStep}
                                onMouseEnter={() => setIsNextHovered(true)}
                                onMouseLeave={() => setIsNextHovered(false)}
                                fontSize="lg" fontWeight="bold" shadow="md"
                            >
                                {currentStep === 1 && "Prosseguir com construção do formulário"}
                                {currentStep === 2 && "Configurar permissões de acesso"}
                                {currentStep === 3 && "Configurar resumo do ticket"}
                            </Button>
                        </HStack>
                    ) : (
                        <HStack w="100%" spacing={4}>
                            <Button
                                size="lg" h="50px" flex={1} variant="outline"
                                borderColor={theme.cardBorder}
                                leftIcon={<AnimatedIcons.AnimatedChevronLeft size={20} isHovered={isBackHovered} />}
                                onClick={() => setCurrentStep(3)}
                                onMouseEnter={() => setIsBackHovered(true)}
                                onMouseLeave={() => setIsBackHovered(false)}
                                color={theme.textPrimary} _hover={{ bg: theme.buttonBg }}
                            >
                                Voltar para permissões
                            </Button>
                            <Button
                                size="lg" h="50px" flex={2}
                                bg={isDarkMode ? "white" : "black"}
                                color={isDarkMode ? "black" : "white"}
                                _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                                leftIcon={<AnimatedIcons.AnimatedRocket size={20} isHovered={isSaveHovered} />}
                                onClick={handleSave}
                                isLoading={isSaving}
                                onMouseEnter={() => setIsSaveHovered(true)}
                                onMouseLeave={() => setIsSaveHovered(false)}
                                fontSize="lg" fontWeight="bold" shadow="md"
                            >
                                Finalizar e Salvar Departamento
                            </Button>
                        </HStack>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};