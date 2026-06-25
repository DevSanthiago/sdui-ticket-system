import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, VStack, FormErrorMessage
} from "@chakra-ui/react";
import { useColorModeValue } from "../../../hooks/theme/useColorModeValue";
import { usePrefixModal } from "../../../hooks/admin/usePrefixModal";
import type { PrefixModalProps } from "../../../types";

export const PrefixModal = ({ isOpen, onClose, onSuccess }: PrefixModalProps) => {
    const isDarkMode = useColorModeValue(false, true);
    const modalBg = useColorModeValue("white", "black");
    const borderColor = useColorModeValue("gray.200", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = useColorModeValue("gray.50", "gray.900");
    const focusBorderColor = useColorModeValue("black", "white");
    const placeholderColor = useColorModeValue("gray.400", "gray.600");

    const { formData, setFormData, errors, loading, handleSubmit } = usePrefixModal({ isOpen, onSuccess });

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={modalBg} border="1px solid" borderColor={borderColor}
                borderRadius="xl" color={textColor}>
                <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
                    Novo Prefixo de Linha
                </ModalHeader>
                <ModalCloseButton color={textColor} />

                <ModalBody py={6}>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.value} isRequired>
                            <FormLabel fontSize="sm" fontWeight="bold">Valor (Sigla)</FormLabel>
                            <Input
                                placeholder="Ex: A1, B2"
                                value={formData.value}
                                bg={inputBg} borderColor={borderColor} color={textColor}
                                _hover={{ borderColor: focusBorderColor }}
                                _focus={{ borderColor: focusBorderColor, boxShadow: "none" }}
                                _placeholder={{ color: placeholderColor }}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value.toUpperCase() })}
                            />
                            <FormErrorMessage>{errors.value}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.label} isRequired>
                            <FormLabel fontSize="sm" fontWeight="bold">Rótulo Automático</FormLabel>
                            <Input
                                placeholder="Gerado automaticamente a partir da sigla"
                                value={formData.label}
                                isReadOnly tabIndex={-1} pointerEvents="none" cursor="not-allowed"
                                bg={inputBg} borderColor={borderColor} color={textColor}
                                _placeholder={{ color: placeholderColor }}
                                _focus={{ borderColor: borderColor, boxShadow: "none" }}
                            />
                            <FormErrorMessage>{errors.label}</FormErrorMessage>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
                    <Button variant="ghost" mr={3} onClick={onClose}
                        color={textColor} _hover={{ bg: inputBg }} minW="120px">
                        Cancelar
                    </Button>
                    <Button
                        bg={isDarkMode ? "white" : "black"} color={isDarkMode ? "black" : "white"}
                        _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                        onClick={handleSubmit} isLoading={loading} minW="120px">
                        Criar Prefixo
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
