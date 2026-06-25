import { useEffect, useState } from "react";
import {
    Box, Heading, Button, VStack, HStack, Stack, Text, IconButton,
    Input, InputGroup, InputLeftElement, Skeleton, SkeletonCircle
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AnimatedRoute, AnimatedPlus, AnimatedChevronLeft } from "../../components/icons/NewAnimatedIcons";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useProductionLinesPage } from "../../hooks/admin/useProductionLinesPage";
import { ProductionLinesTable } from "../../components/admin/cockpit/ProductionLinesTable";
import { ProductionLineModal } from "../../components/admin/cockpit/ProductionLineModal";

export const ProductionLinesPage = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();

    const [isHeaderHovered, setIsHeaderHovered] = useState(true);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);

    const {
        loading,
        searchTerm, setSearchTerm,
        selectedLine,
        includeInactive, setIncludeInactive,
        filteredLinesByPrefix,
        isOpen, onClose,
        handleCreateLine,
        handleEditLine,
        handleActionLine,
        handleActivateLine,
        handleModalSuccess,
    } = useProductionLinesPage(isDarkMode);

    useEffect(() => {
        const timer = setTimeout(() => setIsHeaderHovered(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box h="100%" display="flex" flexDirection="column" overflow="hidden" bg={theme.bgApp}>
            <VStack align="start" spacing={6} w="100%" h="100%" overflow="hidden" p={{ base: 4, md: 8 }}>
                <HStack justify="space-between" w="100%" flexShrink={0}>
                    <HStack align="flex-start" spacing={3}>
                        <IconButton
                            aria-label="Voltar ao Cockpit"
                            icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                            onClick={() => navigate('/cockpit-admin')}
                            variant="ghost" color={theme.textPrimary} mt={1}
                            _hover={{ bg: theme.buttonHoverBg }}
                            onMouseEnter={() => setIsBackHovered(true)}
                            onMouseLeave={() => setIsBackHovered(false)}
                        />
                        <Box mt={1} color={theme.textPrimary} cursor="default"
                            onMouseEnter={() => setIsHeaderHovered(true)}
                            onMouseLeave={() => setIsHeaderHovered(false)}>
                            <SkeletonCircle size="45px" isLoaded={!loading}>
                                <AnimatedRoute isHovered={isHeaderHovered} size={45} />
                            </SkeletonCircle>
                        </Box>
                        <Box>
                            <Skeleton isLoaded={!loading} mb={2} borderRadius="md">
                                <Heading size="lg" color={theme.textPrimary}
                                    onMouseEnter={() => setIsHeaderHovered(true)}
                                    onMouseLeave={() => setIsHeaderHovered(false)}>
                                    Linhas de Produção
                                </Heading>
                            </Skeleton>
                            <Skeleton isLoaded={!loading} borderRadius="md">
                                <Text color={theme.textSecondary}>
                                    Gerencie todas as linhas de produção do sistema
                                </Text>
                            </Skeleton>
                        </Box>
                    </HStack>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Button
                            bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'}
                            onClick={handleCreateLine}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                            display="flex" alignItems="center" gap={2} pl={3} pr={5}
                            _hover={{ bg: isDarkMode ? 'gray.200' : 'gray.800' }}>
                            <AnimatedPlus isHovered={isButtonHovered} size={24} />
                            <Text as="span">Nova Linha</Text>
                        </Button>
                    </Skeleton>
                </HStack>

                <Stack direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}
                    w="100%" spacing={4} flexShrink={0}>
                    <Skeleton isLoaded={!loading} w={{ base: "100%", md: "400px" }} borderRadius="md">
                        <InputGroup maxW={{ base: "full", md: "400px" }}>
                            <InputLeftElement pointerEvents="none">
                                <FaSearch color="gray" />
                            </InputLeftElement>
                            <Input
                                placeholder="Buscar por nome, prefixo ou descrição..."
                                value={searchTerm}
                                bg={theme.cardBg} borderColor={theme.cardBorder}
                                color={theme.textPrimary}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Skeleton>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Button
                            bg={includeInactive ? theme.buttonHoverBg : "transparent"}
                            color={theme.textPrimary} borderColor={theme.cardBorder}
                            borderWidth="1px" size="md"
                            onClick={() => setIncludeInactive(!includeInactive)}
                            _hover={{ bg: theme.buttonHoverBg }}>
                            {includeInactive ? "Mostrar apenas ativas" : "Mostrar todas"}
                        </Button>
                    </Skeleton>
                </Stack>

                <Box w="100%" flex="1" bg={theme.cardBg} borderRadius="xl"
                    border="1px solid" borderColor={theme.cardBorder} p={{ base: 4, md: 6 }}
                    overflow="hidden" display="flex" flexDirection="column">
                    <ProductionLinesTable
                        filteredLinesByPrefix={filteredLinesByPrefix}
                        loading={loading}
                        searchTerm={searchTerm}
                        onEdit={handleEditLine}
                        onAction={handleActionLine}
                        onActivate={handleActivateLine}
                    />
                </Box>
            </VStack>

            <ProductionLineModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={handleModalSuccess}
                line={selectedLine}
            />
        </Box>
    );
};