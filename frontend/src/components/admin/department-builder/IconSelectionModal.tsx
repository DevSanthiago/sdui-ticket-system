import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalCloseButton, Input, SimpleGrid, Flex, Text, HStack, ModalFooter, Button
} from '@chakra-ui/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useIconSelectionModal } from '../../../hooks/admin/useIconSelectionModal';
import { IconPreviewBox } from './IconPreviewBox';
import type { IconSelectionModalProps } from '../../../types';

export const IconSelectionModal = ({
    isOpen, onClose, onSelect, selectedIcon, title = "Selecione um ícone"
}: IconSelectionModalProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const {
        iconSearch, handleSearchChange,
        currentPage, totalPages,
        paginatedIcons, filteredIcons,
        goToPrevPage, goToNextPage,
    } = useIconSelectionModal();

    const handleSelect = (iconValue: string) => {
        onSelect(iconValue);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={theme.bgApp} borderColor={theme.cardBorder}
                borderWidth="1px" borderRadius="xl">
                <ModalHeader color={theme.textPrimary} borderBottomWidth="1px"
                    borderColor={theme.cardBorder} pb={4}>
                    <Text mb={4}>{title}</Text>
                    <Input
                        placeholder="Buscar ícone por nome..."
                        value={iconSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        bg={theme.cardBg} borderColor={theme.cardBorder}
                        color={theme.textPrimary} autoFocus
                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}
                    />
                </ModalHeader>
                <ModalCloseButton color={theme.textSecondary} top={4} />
                <ModalBody p={6} css={{
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' }
                }}>
                    {filteredIcons.length === 0 ? (
                        <Flex justify="center" align="center" h="200px">
                            <Text color={theme.textSecondary}>
                                Nenhum ícone encontrado para "{iconSearch}"
                            </Text>
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 3, sm: 4, md: 5, lg: 6 }} spacing={4}>
                            {paginatedIcons.map((icon) => (
                                <IconPreviewBox
                                    key={icon.value}
                                    iconData={icon}
                                    selectedIcon={selectedIcon}
                                    isDarkMode={isDarkMode}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </ModalBody>
                {totalPages > 1 && (
                    <ModalFooter borderTopWidth="1px" borderColor={theme.cardBorder}
                        justifyContent="space-between">
                        <Text fontSize="sm" color={theme.textSecondary}>
                            Página {currentPage + 1} de {totalPages}
                        </Text>
                        <HStack spacing={2}>
                            <Button size="sm" variant="outline" leftIcon={<ArrowLeft size={16} />}
                                onClick={goToPrevPage} isDisabled={currentPage === 0}
                                color={theme.textPrimary} borderColor={theme.cardBorder}
                                _hover={{ bg: theme.buttonBg }}>
                                Anterior
                            </Button>
                            <Button size="sm" variant="outline" rightIcon={<ArrowRight size={16} />}
                                onClick={goToNextPage} isDisabled={currentPage === totalPages - 1}
                                color={theme.textPrimary} borderColor={theme.cardBorder}
                                _hover={{ bg: theme.buttonBg }}>
                                Próximo
                            </Button>
                        </HStack>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
};