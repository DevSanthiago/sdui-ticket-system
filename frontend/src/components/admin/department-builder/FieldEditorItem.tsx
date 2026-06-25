import { memo } from 'react';
import { Box, VStack, HStack, Input, Flex, Text, Select, Switch, IconButton, Button, Tooltip, SimpleGrid, Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import { Trash2, Plus, Info, GitBranch } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { InlineIconSelector } from './InlineIconSelector';
import { StaticDatabaseBackup } from '../../icons/StaticIcons';
import { TEMPLATE_VALUE_PREFIX, CREATE_TYPE_ACTION } from '../../../constants/admin/fieldBuilderConstants';
import type { FieldEditorItemProps, AnimatedIconKey, FormFieldOption } from '../../../types';

const FieldEditorItemComponent = ({
    field, index, allFields, isDarkMode, fieldTemplates,
    hideConditional = false, hideRemove = false,
    onUpdate, onTypeChange, onRemove, onAddOption, onUpdateOption,
    onRemoveOption, onSelectOptionIcon, onOpenIconModal, onChangeFields,
}: FieldEditorItemProps) => {
    const theme = useMinimalTheme();

    const LOCKED_FIELD_TYPES = ['dynamic_location', 'line_stop', 'setup_product'];
    const isLocked = LOCKED_FIELD_TYPES.includes(field.type);

    const selectedTypeValue = field.templateId && fieldTemplates.some(t => t.id === field.templateId)
        ? `${TEMPLATE_VALUE_PREFIX}${field.templateId}`
        : field.type;

    const availableParentFields = allFields
        .slice(0, index)
        .filter(f => (f.type === 'select' || f.type === 'card_radio') && f.options && f.options.length > 0);

    const selectedDepValues = field.dependsOn
        ? (Array.isArray(field.dependsOn.value)
            ? field.dependsOn.value
            : field.dependsOn.value ? [field.dependsOn.value] : [])
        : [];

    return (
        <Box bg={theme.bgApp} p={4} borderRadius="lg" borderWidth="1px"
            borderColor={theme.cardBorder} position="relative">
            {!hideRemove && (
                <IconButton aria-label="Remover campo" icon={<Trash2 size={16} />}
                    size="sm" colorScheme="red" variant="ghost"
                    position="absolute" top={2} right={2}
                    onClick={() => onRemove(index)} />
            )}

            <VStack spacing={3} align="stretch" mt={1} pr={8}>
                <HStack>
                    <Box flex={1}>
                        <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>Tipo do Campo</Text>
                        <Select size="sm" value={selectedTypeValue}
                            onChange={(e) => onTypeChange(index, e.target.value)}
                            bg={isDarkMode ? '#000000' : '#FFFFFF'}
                            borderColor={theme.cardBorder} color={theme.textPrimary}
                            sx={{ '> option, > optgroup': { bg: isDarkMode ? '#000000' : '#FFFFFF' } }}
                            _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}>
                            <option value="text">Texto Curto</option>
                            <option value="textarea">Área de Texto</option>
                            <option value="select">Lista Suspensa Simples</option>
                            <option value="dynamic_location">Localizador e Linha (Dynamic Data)</option>
                            <option value="line_stop">Parada de Linha (Status e Horário)</option>
                            <option value="setup_material">Informe o Material (Specific Data)</option>
                            <option value="card_radio">Cards Selecionáveis</option>
                            {fieldTemplates.length > 0 && (
                                <optgroup label="Tipos customizados">
                                    {fieldTemplates.map(tpl => (
                                        <option key={tpl.id} value={`${TEMPLATE_VALUE_PREFIX}${tpl.id}`}>
                                            ⭐ {tpl.name}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            <option value={CREATE_TYPE_ACTION}>+ Criar ou editar tipo de campo</option>
                        </Select>
                    </Box>
                    <Box flex={2}>
                        <HStack mb={1} spacing={1}>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary}>ID do Campo</Text>
                            <Tooltip hasArrow placement="top"
                                label="Identificador único usado pelo sistema para integrações (ex: SAP, PowerBI). Gerado automaticamente a partir do título.">
                                <Box color={theme.textSecondary} cursor="help"><Info size={12} /></Box>
                            </Tooltip>
                        </HStack>
                        <Input size="sm" placeholder="id_da_pergunta" value={field.id}
                            isDisabled={isLocked}
                            onChange={(e) => onUpdate(index, 'id', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                            bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                            _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                    </Box>
                </HStack>

                <Box>
                    <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>Pergunta / Título</Text>
                    <Input size="sm" placeholder="Sua pergunta aqui" value={field.label}
                        isDisabled={isLocked}
                        onChange={(e) => onUpdate(index, 'label', e.target.value)}
                        bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                </Box>

                {field.type === 'dynamic_location' && (
                    <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px"
                        borderColor="blue.500" borderStyle="dashed">
                        <HStack>
                            <Box color="blue.500"><StaticDatabaseBackup size={20} /></Box>
                            <Text fontSize="sm" color={theme.textPrimary}>
                                Este campo carregará os <strong>Localizadores e Linhas de Produção</strong> automaticamente do banco de dados. Nenhuma configuração adicional é necessária.
                            </Text>
                        </HStack>
                    </Box>
                )}

                {field.type === 'line_stop' && (
                    <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px"
                        borderColor="red.500" borderStyle="dashed">
                        <HStack>
                            <Box color="red.500"><Info size={20} /></Box>
                            <Text fontSize="sm" color={theme.textPrimary}>
                                Este campo renderiza um <strong>Smart Card</strong> que captura o status da linha e o horário automaticamente.
                            </Text>
                        </HStack>
                    </Box>
                )}

                {field.type === 'setup_material' && (
                    <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px"
                        borderColor="purple.500" borderStyle="dashed">
                        <HStack>
                            <Box color="purple.500"><Info size={20} /></Box>
                            <Text fontSize="sm" color={theme.textPrimary}>
                                Este campo renderiza uma entrada específica para <strong>Produto em Setup</strong>, mapeado para os fluxos da Engenharia de Setup.
                            </Text>
                        </HStack>
                    </Box>
                )}

                {field.type === 'select' && (
                    <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px" borderColor={theme.cardBorder}>
                        <Flex justify="space-between" align="center" mb={2}>
                            <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>Opções da Lista</Text>
                            <Button size="xs" colorScheme="green" variant="outline"
                                leftIcon={<Plus size={12} />} onClick={() => onAddOption(index)}>
                                Adicionar
                            </Button>
                        </Flex>
                        <VStack spacing={2} align="stretch" mt={3}>
                            {field.options?.map((opt: FormFieldOption, optIdx: number) => (
                                <HStack key={optIdx}>
                                    <Input size="xs" value={opt.label} placeholder="Texto da Opção"
                                        onChange={(e) => onUpdateOption(index, optIdx, e.target.value)}
                                        bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                        _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                    <IconButton aria-label="Remover opção" icon={<Trash2 size={12} />}
                                        size="xs" colorScheme="red" variant="ghost"
                                        onClick={() => onRemoveOption(index, optIdx)} />
                                </HStack>
                            ))}
                            {(!field.options || field.options.length === 0) && (
                                <Text fontSize="xs" color={theme.textSecondary} textAlign="center">
                                    Nenhuma opção adicionada.
                                </Text>
                            )}
                        </VStack>
                    </Box>
                )}

                {field.type === 'card_radio' && (
                    <Box p={3} bg={theme.buttonBg} borderRadius="md" borderWidth="1px" borderColor={theme.cardBorder}>
                        <Flex justify="space-between" align="center" mb={2}>
                            <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>Opções</Text>
                            <Button size="xs" colorScheme="green" variant="outline"
                                leftIcon={<Plus size={12} />} onClick={() => onAddOption(index)}>
                                Adicionar
                            </Button>
                        </Flex>
                        <VStack spacing={4} align="stretch" mt={3}>
                            {field.options?.map((opt: FormFieldOption, optIdx: number) => (
                                <Box key={optIdx} p={3} bg={theme.cardBg} borderRadius="md"
                                    borderWidth="1px" borderColor={theme.cardBorder}>
                                    <HStack mb={2}>
                                        <Input size="xs" value={opt.label} placeholder="Texto da Opção"
                                            onChange={(e) => onUpdateOption(index, optIdx, e.target.value)}
                                            bg={theme.bgApp} borderColor={theme.cardBorder} color={theme.textPrimary}
                                            _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }} />
                                        <IconButton aria-label="Remover opção" icon={<Trash2 size={12} />}
                                            size="xs" colorScheme="red" variant="ghost"
                                            onClick={() => onRemoveOption(index, optIdx)} />
                                    </HStack>
                                    <InlineIconSelector
                                        selectedIconName={opt.iconName ?? ''}
                                        cardBorder={theme.cardBorder}
                                        bgApp={theme.bgApp}
                                        textSecondary={theme.textSecondary}
                                        isDarkMode={isDarkMode}
                                        onSelect={(iconName: AnimatedIconKey) => onSelectOptionIcon(index, optIdx, iconName)}
                                        onOpenModal={() => onOpenIconModal(index, optIdx)}
                                    />
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                )}

                {!hideConditional && availableParentFields.length > 0 && (
                    <Box mt={2} mb={2} p={3} borderRadius="md" borderWidth="1px"
                        borderColor={theme.cardBorder} borderStyle="dashed"
                        bg={isDarkMode ? "whiteAlpha.50" : "blackAlpha.50"}>
                        <HStack mb={2}>
                            <Box color="blue.500"><GitBranch size={14} /></Box>
                            <Text fontSize="xs" fontWeight="bold" color={theme.textPrimary}>
                                Lógica Condicional (Opcional)
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color={theme.textSecondary} mb={3}>
                            Exibir este campo apenas se uma pergunta anterior tiver uma resposta específica.
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box>
                                <Text fontSize="10px" fontWeight="bold" color={theme.textSecondary}
                                    textTransform="uppercase" mb={1}>
                                    Depende da pergunta
                                </Text>
                                <Select size="xs" placeholder="Nenhuma (Sempre exibir)"
                                    value={field.dependsOn?.field || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val) {
                                            const newFields = [...allFields];
                                            delete newFields[index].dependsOn;
                                            onChangeFields(newFields);
                                        } else {
                                            onUpdate(index, 'dependsOn', { field: val, value: [] });
                                        }
                                    }}
                                    bg={theme.cardBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                    sx={{ '> option': { bg: isDarkMode ? '#000000' : '#FFFFFF' } }}
                                    _focus={{ borderColor: isDarkMode ? "white" : "black", boxShadow: "none" }}>
                                    {availableParentFields.map(pf => (
                                        <option key={pf.id} value={pf.id}>{pf.label || pf.id}</option>
                                    ))}
                                </Select>
                            </Box>
                            {field.dependsOn?.field && (
                                <Box>
                                    <Text fontSize="10px" fontWeight="bold" color={theme.textSecondary}
                                        textTransform="uppercase" mb={1}>
                                        Quando a resposta for (uma ou mais)
                                    </Text>
                                    <CheckboxGroup
                                        value={selectedDepValues}
                                        onChange={(vals) => {
                                            if (field.dependsOn?.field) {
                                                onUpdate(index, 'dependsOn', {
                                                    field: field.dependsOn.field,
                                                    value: vals as string[]
                                                });
                                            }
                                        }}>
                                        <Stack spacing={1} bg={theme.cardBg} borderWidth="1px"
                                            borderColor={theme.cardBorder} borderRadius="md" p={2}>
                                            {allFields.find(f => f.id === field.dependsOn?.field)?.options?.map(opt => (
                                                <Checkbox key={opt.value} value={opt.value} size="sm"
                                                    colorScheme="blue" color={theme.textPrimary}>
                                                    <Text fontSize="xs">{opt.label}</Text>
                                                </Checkbox>
                                            ))}
                                        </Stack>
                                    </CheckboxGroup>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Box>
                )}

                <HStack justify="flex-end" pt={1}>
                    <Text fontSize="sm" fontWeight="bold" transition="color 0.2s ease"
                        color={field.required ? (isDarkMode ? 'white' : 'black') : theme.textSecondary}>
                        Obrigatório
                    </Text>
                    <Switch size="sm" colorScheme="green" isChecked={field.required}
                        onChange={(e) => onUpdate(index, 'required', e.target.checked)}
                        sx={{
                            '.chakra-switch__track[data-checked]': { bg: isDarkMode ? 'white' : 'black' },
                            '.chakra-switch__thumb[data-checked]': { bg: isDarkMode ? 'black' : 'white' }
                        }} />
                </HStack>
            </VStack>
        </Box>
    );
};

// Compara tudo menos `allFields` (nova ref a cada tecla). Os handlers são estáveis
// (useCallback) e leem o estado mais recente via ref, então ignorar allFields é seguro:
// só o campo de fato editado (nova ref de `field`) re-renderiza.
const areEqual = (prev: FieldEditorItemProps, next: FieldEditorItemProps): boolean =>
    prev.field === next.field &&
    prev.index === next.index &&
    prev.isDarkMode === next.isDarkMode &&
    prev.fieldTemplates === next.fieldTemplates &&
    prev.hideConditional === next.hideConditional &&
    prev.hideRemove === next.hideRemove &&
    prev.onUpdate === next.onUpdate &&
    prev.onTypeChange === next.onTypeChange &&
    prev.onRemove === next.onRemove &&
    prev.onAddOption === next.onAddOption &&
    prev.onUpdateOption === next.onUpdateOption &&
    prev.onRemoveOption === next.onRemoveOption &&
    prev.onSelectOptionIcon === next.onSelectOptionIcon &&
    prev.onOpenIconModal === next.onOpenIconModal &&
    prev.onChangeFields === next.onChangeFields;

export const FieldEditorItem = memo(FieldEditorItemComponent, areEqual);