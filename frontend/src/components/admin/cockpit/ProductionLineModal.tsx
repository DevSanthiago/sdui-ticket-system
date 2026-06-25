import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    ModalCloseButton, Button, FormControl, FormLabel, Input, Textarea,
    VStack, FormErrorMessage, Switch, HStack, Text
} from "@chakra-ui/react";
import { useColorModeValue } from "../../../hooks/theme/useColorModeValue";
import { useProductionLineModal } from "../../../hooks/admin/useProductionLineModal";
import { ThemedSelect } from "../../common/ThemedSelect";
import type { ProductionLineModalProps } from "../../../types";

export const ProductionLineModal = ({ isOpen, onClose, onSuccess, line }: ProductionLineModalProps) => {
    const isDarkMode = useColorModeValue(false, true);
    const modalBg = useColorModeValue("white", "black");
    const borderColor = useColorModeValue("gray.200", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const inputBg = useColorModeValue("gray.50", "gray.900");
    const focusBorderColor = useColorModeValue("black", "white");

    const {
        availablePrefixes, formData, setFormData,
        errors, loading,
        handleLineNameChange, handleSubmit,
    } = useProductionLineModal({ isOpen, onSuccess, line, isDarkMode });

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={modalBg} border="1px solid" borderColor={borderColor}
                borderRadius="xl" boxShadow="2xl">
                <ModalHeader color={textColor} borderBottomWidth="1px" borderColor={borderColor}>
                    {line ? "Editar Linha de Produção" : "Nova Linha de Produção"}
                </ModalHeader>
                <ModalCloseButton color={textColor} />

                <ModalBody py={6}>
                    <VStack spacing={5} align="stretch">
                        <FormControl isInvalid={!!errors.lineName} isRequired>
                            <FormLabel color={textColor} fontSize="sm" fontWeight="bold">Nome da Linha</FormLabel>
                            <Input
                                placeholder="Ex: MB01, ZB01"
                                value={formData.lineName}
                                onChange={handleLineNameChange}
                                textTransform="uppercase" maxLength={50}
                                bg={inputBg} borderColor={borderColor} color={textColor}
                                _hover={{ borderColor: focusBorderColor }}
                                _focus={{ borderColor: focusBorderColor, boxShadow: "none" }}
                            />
                            <FormErrorMessage>{errors.lineName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.prefix} isRequired>
                            <FormLabel color={textColor} fontSize="sm" fontWeight="bold">Prefixo</FormLabel>
                            <ThemedSelect
                                value={formData.prefix}
                                onChange={(v) => setFormData(prev => ({ ...prev, prefix: v }))}
                                placeholder="Selecione um prefixo"
                                options={availablePrefixes.map(p => ({ value: p.value, label: `${p.label} (${p.value})` }))}
                            />
                            <FormErrorMessage>{errors.prefix}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel color={textColor} fontSize="sm" fontWeight="bold">
                                Descrição Automática
                            </FormLabel>
                            <Textarea
                                placeholder="Gerada automaticamente a partir do prefixo e do nome da linha"
                                value={formData.description ?? ""}
                                isReadOnly tabIndex={-1} pointerEvents="none"
                                bg={inputBg} borderColor={borderColor} color={textColor}
                                rows={2} cursor="not-allowed"
                                _hover={{ borderColor: borderColor }}
                                _focus={{ borderColor: borderColor, boxShadow: "none" }}
                            />
                            <Text fontSize="xs" color={textColor} opacity={0.6} mt={1}>
                                Padronizada automaticamente para manter as linhas uniformes.
                            </Text>
                        </FormControl>

                        {line && (
                            <FormControl pt={2}>
                                <HStack justify="space-between" p={3} borderRadius="md"
                                    bg={inputBg} border="1px solid" borderColor={borderColor}>
                                    <FormLabel mb={0} color={textColor} fontSize="sm">Status da Linha</FormLabel>
                                    <HStack>
                                        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase"
                                            color={formData.isActive ? "green.400" : "red.400"}>
                                            {formData.isActive ? "Ativa" : "Inativa"}
                                        </Text>
                                        <Switch colorScheme="green" isChecked={formData.isActive}
                                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                                    </HStack>
                                </HStack>
                            </FormControl>
                        )}
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
                        {line ? "Atualizar" : "Criar Linha"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};