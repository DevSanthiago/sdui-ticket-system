import { useState, useCallback } from 'react';
import { Box, Flex, Heading, HStack, Button, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { ListTree, List } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { StaticFileText } from '../../icons/StaticIcons';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import { IconSelectionModal } from './IconSelectionModal';
import { FieldEditorItem } from './FieldEditorItem';
import { FieldTreeView } from './FieldTreeView';
import { FormBuilderPreview } from './FormBuilderPreview';
import { FieldTypeBuilderModal } from './FieldTypeBuilderModal';
import { useFormBuilder } from '../../../hooks/admin/useFormBuilder';
import { useFieldTreeBuilder } from '../../../hooks/admin/useFieldTreeBuilder';
import type { FormBuilderStepProps } from '../../../types';

export const FormBuilderStep = ({ fields, onChange, departmentName }: FormBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const { isOpen: isIconModalOpen, onOpen: onOpenIconModal, onClose: onCloseIconModal } = useDisclosure();
    const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

    const {
        activeIconSelection,
        isAddHovered, setIsAddHovered,
        handleAddField,
        handleUpdateField,
        handleRemoveField,
        handleAddOption,
        handleUpdateOption,
        handleRemoveOption,
        handleSelectOptionIcon,
        handleUpdateOptionIcon,
        handleOpenIconModal,
        fieldTemplates,
        isSavingTemplate,
        handleFieldTypeChange,
        handleCreateTemplate,
        handleUpdateTemplate,
        deleteTemplate,
        isTypeModalOpen,
        handleCloseTypeModal,
    } = useFormBuilder({ fields, onChange, isDarkMode });

    const {
        tree,
        isCollapsed,
        toggleCollapse,
        addRoot,
        addChildUnderOption,
        removeSubtree,
        reorderSiblings,
    } = useFieldTreeBuilder({ fields, onChange, isDarkMode });

    const openIconModalForField = useCallback((fieldIndex: number, optionIndex: number) => {
        handleOpenIconModal(fieldIndex, optionIndex);
        onOpenIconModal();
    }, [handleOpenIconModal, onOpenIconModal]);

    return (
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: "auto", lg: "500px" }} w="100%">
            <Flex flex={1} bg={theme.cardBg} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
                <Box w="100%" pt={5} px={5} bg={theme.cardBg} zIndex={1}>
                    <Flex justify="space-between" align="center" pb={3}
                        borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <HStack>
                            <Box color={theme.iconColor} display="flex"><StaticFileText size={20} /></Box>
                            <Heading size="sm" color={theme.textPrimary}>Construtor de formulários</Heading>
                        </HStack>
                        <HStack spacing={2}>
                            <HStack spacing={0} borderWidth="1px" borderColor={theme.cardBorder}
                                borderRadius="md" overflow="hidden">
                                <Button size="sm" borderRadius="0" leftIcon={<ListTree size={14} />}
                                    onClick={() => setViewMode('tree')}
                                    bg={viewMode === 'tree' ? (isDarkMode ? 'white' : 'black') : 'transparent'}
                                    color={viewMode === 'tree' ? (isDarkMode ? 'black' : 'white') : theme.textSecondary}
                                    _hover={{ bg: viewMode === 'tree' ? (isDarkMode ? 'gray.200' : 'gray.800') : theme.buttonBg }}>
                                    Árvore
                                </Button>
                                <Button size="sm" borderRadius="0" leftIcon={<List size={14} />}
                                    onClick={() => setViewMode('list')}
                                    bg={viewMode === 'list' ? (isDarkMode ? 'white' : 'black') : 'transparent'}
                                    color={viewMode === 'list' ? (isDarkMode ? 'black' : 'white') : theme.textSecondary}
                                    _hover={{ bg: viewMode === 'list' ? (isDarkMode ? 'gray.200' : 'gray.800') : theme.buttonBg }}>
                                    Lista
                                </Button>
                            </HStack>
                            {viewMode === 'list' && (
                                <Button
                                    leftIcon={<AnimatedIcons.AnimatedPlus size={16} isHovered={isAddHovered} />}
                                    bg={isDarkMode ? "white" : "black"}
                                    color={isDarkMode ? "black" : "white"}
                                    _hover={{ bg: isDarkMode ? "gray.200" : "gray.800" }}
                                    size="sm" onClick={handleAddField}
                                    onMouseEnter={() => setIsAddHovered(true)}
                                    onMouseLeave={() => setIsAddHovered(false)}>
                                    Novo Campo
                                </Button>
                            )}
                        </HStack>
                    </Flex>
                </Box>

                <Box flex={1} w="100%" p={5} overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    {viewMode === 'tree' ? (
                        <FieldTreeView
                            nodes={tree}
                            fields={fields}
                            isDarkMode={isDarkMode}
                            fieldTemplates={fieldTemplates}
                            isCollapsed={isCollapsed}
                            onToggleCollapse={toggleCollapse}
                            onAddRoot={addRoot}
                            onAddChildUnderOption={addChildUnderOption}
                            onRemoveSubtree={removeSubtree}
                            onReorderSiblings={reorderSiblings}
                            onUpdate={handleUpdateField}
                            onTypeChange={handleFieldTypeChange}
                            onAddOption={handleAddOption}
                            onUpdateOption={handleUpdateOption}
                            onRemoveOption={handleRemoveOption}
                            onSelectOptionIcon={handleSelectOptionIcon}
                            onOpenIconModal={openIconModalForField}
                            onChangeFields={onChange}
                        />
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {fields.length === 0 && (
                                <Box textAlign="center" p={6} bg={theme.bgApp} borderRadius="lg"
                                    borderStyle="dashed" borderWidth="1px" borderColor={theme.cardBorder}>
                                    <Text color={theme.textSecondary}>Nenhum campo adicionado.</Text>
                                </Box>
                            )}
                            {fields.map((field, index) => (
                                <FieldEditorItem
                                    key={index}
                                    field={field}
                                    index={index}
                                    allFields={fields}
                                    isDarkMode={isDarkMode}
                                    fieldTemplates={fieldTemplates}
                                    onUpdate={handleUpdateField}
                                    onTypeChange={handleFieldTypeChange}
                                    onRemove={handleRemoveField}
                                    onAddOption={handleAddOption}
                                    onUpdateOption={handleUpdateOption}
                                    onRemoveOption={handleRemoveOption}
                                    onSelectOptionIcon={handleSelectOptionIcon}
                                    onOpenIconModal={openIconModalForField}
                                    onChangeFields={onChange}
                                />
                            ))}
                        </VStack>
                    )}
                </Box>
            </Flex>

            <FormBuilderPreview fields={fields} departmentName={departmentName} />

            <IconSelectionModal
                isOpen={isIconModalOpen}
                onClose={onCloseIconModal}
                onSelect={handleUpdateOptionIcon}
                selectedIcon={activeIconSelection
                    ? fields[activeIconSelection.fieldIndex]?.options?.[activeIconSelection.optionIndex]?.iconName
                    : undefined}
                title="Selecione o ícone da opção"
            />

            <FieldTypeBuilderModal
                isOpen={isTypeModalOpen}
                onClose={handleCloseTypeModal}
                templates={fieldTemplates}
                isSaving={isSavingTemplate}
                onCreate={handleCreateTemplate}
                onUpdate={handleUpdateTemplate}
                onDelete={deleteTemplate}
            />
        </Flex>
    );
};