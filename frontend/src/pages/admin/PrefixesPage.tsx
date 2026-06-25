import { useEffect, useState } from "react";
import {
    Box, Heading, Button, VStack, HStack, Text, IconButton,
    useDisclosure, Skeleton, SkeletonCircle
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AnimatedSettings, AnimatedPlus, AnimatedChevronLeft } from "../../components/icons/NewAnimatedIcons";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { usePrefixesPage } from "../../hooks/admin/usePrefixesPage";
import { PrefixesTable } from "../../components/admin/cockpit/PrefixesTable";
import { PrefixModal } from "../../components/admin/cockpit/PrefixModal";

export const PrefixesPage = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isHeaderHovered, setIsHeaderHovered] = useState(true);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isBackHovered, setIsBackHovered] = useState(false);

    const { prefixes, loading, fetchPrefixes, handleDeleteClick } = usePrefixesPage(isDarkMode);

    useEffect(() => {
        const timer = setTimeout(() => setIsHeaderHovered(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box h="100%" display="flex" flexDirection="column" bg={theme.bgApp}>
            <VStack align="start" spacing={6} w="100%" h="100%" p={{ base: 4, md: 8 }}>
                <HStack justify="space-between" w="100%" flexShrink={0}>
                    <HStack spacing={4} align="flex-start">
                        <IconButton
                            aria-label="Voltar ao Cockpit"
                            icon={<AnimatedChevronLeft isHovered={isBackHovered} />}
                            onClick={() => navigate('/cockpit-admin')}
                            variant="ghost" color={theme.textPrimary} mt={1}
                            _hover={{ bg: theme.buttonHoverBg }}
                            onMouseEnter={() => setIsBackHovered(true)}
                            onMouseLeave={() => setIsBackHovered(false)}
                        />
                        <Box
                            onMouseEnter={() => setIsHeaderHovered(true)}
                            onMouseLeave={() => setIsHeaderHovered(false)}
                            color={theme.textPrimary} pt={1} cursor="default"
                        >
                            <SkeletonCircle size="45px" isLoaded={!loading}>
                                <AnimatedSettings isHovered={isHeaderHovered} size={45} />
                            </SkeletonCircle>
                        </Box>
                        <Box>
                            <Skeleton isLoaded={!loading} mb={2} borderRadius="md">
                                <Heading size="lg" color={theme.textPrimary}>
                                    Gerenciamento de Prefixos
                                </Heading>
                            </Skeleton>
                            <Skeleton isLoaded={!loading} borderRadius="md">
                                <Text color={theme.textSecondary}>
                                    Configure as categorias das linhas de produção
                                </Text>
                            </Skeleton>
                        </Box>
                    </HStack>

                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Button
                            leftIcon={<AnimatedPlus isHovered={isButtonHovered} size={24} />}
                            bg={isDarkMode ? 'white' : 'black'} color={isDarkMode ? 'black' : 'white'}
                            onClick={onOpen}
                            onMouseEnter={() => setIsButtonHovered(true)}
                            onMouseLeave={() => setIsButtonHovered(false)}
                            _hover={{ bg: isDarkMode ? 'gray.200' : 'gray.800' }}
                            pl={4} pr={6}
                        >
                            Novo Prefixo
                        </Button>
                    </Skeleton>
                </HStack>

                <Box
                    w="100%" flex="1" bg={theme.cardBg} borderRadius="xl"
                    border="1px solid" borderColor={theme.cardBorder} p={{ base: 4, md: 6 }}
                    display="flex" flexDirection="column" minH="0" overflow="hidden"
                >
                    <Box flex="1" overflow="auto">
                        <PrefixesTable
                            prefixes={prefixes}
                            loading={loading}
                            onDelete={handleDeleteClick}
                        />
                    </Box>
                </Box>
            </VStack>

            <PrefixModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => { onClose(); fetchPrefixes(true); }}
            />
        </Box>
    );
};