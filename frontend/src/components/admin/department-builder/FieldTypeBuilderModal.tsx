import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    ModalCloseButton, Box, VStack, HStack, Flex, Text, Input, Select, Switch,
    Button, IconButton, Divider
} from '@chakra-ui/react';
import { Trash2, Plus, Star, Pencil } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { useFieldTypeBuilder } from '../../../hooks/admin/useFieldTypeBuilder';
import { Alert } from '../../../services/alerts/alertService';
import type { FieldTypeBuilderModalProps, FieldTemplateBaseType, FormFieldOption } from '../../../types';

export const FieldTypeBuilderModal = ({
    isOpen, onClose, templates, isSaving, onCreate, onUpdate, onDelete
}: FieldTypeBuilderModalProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const selectBg = isDarkMode ? '#000000' : '#FFFFFF';

    const {
        editingId,
        name, setName, baseType, setBaseType, label, setLabel,
        required, setRequired, options, hasOptions,
        addOption, updateOption, removeOption, reset, loadTemplate, buildPayload,
    } = useFieldTypeBuilder();

    const isEditing = editingId !== null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSave = async () => {
        const payload = buildPayload();
        if (!payload) {
            return Alert.warning(
                'Atenção',
                hasOptions
                    ? 'Informe um nome para o tipo e adicione pelo menos uma opção.'
                    : 'Informe um nome para o tipo de campo.',
                isDarkMode
            );
        }

        if (editingId !== null) {
            const updated = await onUpdate(editingId, payload);
            if (updated) reset();
            return;
        }

        const created = await onCreate(payload);
        if (created) {
            reset();
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={theme.bgApp} borderColor={theme.cardBorder}
                borderWidth="1px" borderRadius="xl">
                <ModalHeader color={theme.textPrimary} borderBottomWidth="1px"
                    borderColor={theme.cardBorder} pb={4}>
                    <HStack>
                        <Box color="blue.400">{isEditing ? <Pencil size={20} /> : <Star size={20} />}</Box>
                        <Text>{isEditing ? 'Editar tipo de campo' : 'Criar novo tipo de campo'}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color={theme.textSecondary} top={4} />
                <ModalBody p={6} css={{
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: theme.cardBorder, borderRadius: '4px' }
                }}>
                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>
                                Nome do tipo
                            </Text>
                            <Input size="sm" placeholder="Ex: Severidade, Localização manual" value={name}
                                onChange={(e) => setName(e.target.value)}
                                bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                        </Box>

                        <HStack align="start" spacing={4}>
                            <Box flex={1}>
                                <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>
                                    Tipo-base
                                </Text>
                                <Select size="sm" value={baseType}
                                    onChange={(e) => setBaseType(e.target.value as FieldTemplateBaseType)}
                                    bg={selectBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                    sx={{ '> option': { bg: selectBg } }}
                                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}>
                                    <option value="text">Texto Curto</option>
                                    <option value="textarea">Área de Texto</option>
                                    <option value="select">Lista Suspensa Simples</option>
                                    <option value="card_radio">Cards Selecionáveis</option>
                                </Select>
                            </Box>
                            <Box flex={1}>
                                <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>
                                    Título padrão
                                </Text>
                                <Input size="sm" placeholder="Pergunta exibida no formulário" value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                            </Box>
                        </HStack>

                        {hasOptions && (
                            <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px"
                                borderColor={theme.cardBorder}>
                                <Flex justify="space-between" align="center" mb={2}>
                                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>Opções</Text>
                                    <Button size="xs" colorScheme="green" variant="outline"
                                        leftIcon={<Plus size={12} />} onClick={addOption}>
                                        Adicionar
                                    </Button>
                                </Flex>
                                <VStack spacing={2} align="stretch" mt={2}>
                                    {options.map((opt: FormFieldOption, optIdx: number) => (
                                        <HStack key={optIdx}>
                                            <Input size="xs" value={opt.label} placeholder="Texto da Opção"
                                                onChange={(e) => updateOption(optIdx, e.target.value)}
                                                bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                                _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                            <IconButton aria-label="Remover opção" icon={<Trash2 size={12} />}
                                                size="xs" colorScheme="red" variant="ghost"
                                                onClick={() => removeOption(optIdx)} />
                                        </HStack>
                                    ))}
                                    {options.length === 0 && (
                                        <Text fontSize="xs" color={theme.textSecondary} textAlign="center">
                                            Nenhuma opção adicionada.
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        )}

                        <HStack justify="flex-end">
                            <Text fontSize="sm" fontWeight="bold"
                                color={required ? (isDarkMode ? 'white' : 'black') : theme.textSecondary}>
                                Obrigatório
                            </Text>
                            <Switch size="sm" colorScheme="green" isChecked={required}
                                onChange={(e) => setRequired(e.target.checked)}
                                sx={{
                                    '.chakra-switch__track[data-checked]': { bg: isDarkMode ? 'white' : 'black' },
                                    '.chakra-switch__thumb[data-checked]': { bg: isDarkMode ? 'black' : 'white' }
                                }} />
                        </HStack>

                        {templates.length > 0 && (
                            <>
                                <Divider borderColor={theme.cardBorder} />
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={2}
                                        textTransform="uppercase">
                                        Tipos já criados
                                    </Text>
                                    <VStack spacing={2} align="stretch">
                                        {templates.map((tpl) => (
                                            <HStack key={tpl.id} justify="space-between"
                                                p={2} bg={theme.cardBg} borderRadius="md"
                                                borderWidth="1px" borderColor={theme.cardBorder}>
                                                <HStack spacing={2}>
                                                    <Box color={editingId === tpl.id ? "orange.400" : "blue.400"}><Star size={14} /></Box>
                                                    <Text fontSize="sm" fontWeight={editingId === tpl.id ? "bold" : "normal"}
                                                        color={theme.textPrimary}>{tpl.name}</Text>
                                                </HStack>
                                                <HStack spacing={1}>
                                                    <IconButton aria-label="Editar tipo" icon={<Pencil size={14} />}
                                                        size="xs" variant="ghost" color={theme.textSecondary}
                                                        onClick={() => loadTemplate(tpl)} />
                                                    <IconButton aria-label="Excluir tipo" icon={<Trash2 size={14} />}
                                                        size="xs" colorScheme="red" variant="ghost"
                                                        onClick={() => onDelete(tpl)} />
                                                </HStack>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Box>
                            </>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter borderTopWidth="1px" borderColor={theme.cardBorder} gap={3}>
                    <Button size="sm" variant="outline" onClick={handleClose}
                        color={theme.textPrimary} borderColor={theme.cardBorder}
                        _hover={{ bg: theme.buttonBg }}>
                        Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSave} isLoading={isSaving}
                        bg={isDarkMode ? "white" : "black"} color={isDarkMode ? "black" : "white"}
                        _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}>
                        {isEditing ? 'Salvar alterações' : 'Salvar tipo'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
