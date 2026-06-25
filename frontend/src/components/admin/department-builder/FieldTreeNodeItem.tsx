import { memo } from 'react';
import { Box, VStack, HStack, Text, IconButton, Button } from '@chakra-ui/react';
import { Reorder, useDragControls } from 'framer-motion';
import { ChevronDown, ChevronRight, Trash2, Plus, Layers, GripVertical } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { FieldEditorItem } from './FieldEditorItem';
import { isBranchCapable } from '../../../helpers/fieldTreeHelpers';
import type { FieldTreeNodeItemProps, FieldTreeNode } from '../../../types';

const FieldTreeNodeItemComponent = ({
    node, depth, fields, isDarkMode, fieldTemplates,
    isCollapsed, onToggleCollapse, onAddChildUnderOption, onRemoveSubtree, onReorderSiblings,
    onUpdate, onTypeChange, onAddOption, onUpdateOption, onRemoveOption,
    onSelectOptionIcon, onOpenIconModal, onChangeFields,
}: FieldTreeNodeItemProps) => {
    const theme = useMinimalTheme();
    const dragControls = useDragControls();
    const field = node.field;
    const uid = field.uid ?? field.id;
    const index = fields.findIndex(f => field.uid ? f.uid === field.uid : f.id === field.id);
    const branchCapable = isBranchCapable(field);
    const collapsed = isCollapsed(field.id);

    return (
        <Reorder.Item value={uid} dragListener={false} dragControls={dragControls}
            as="div" style={{ listStyle: 'none' }}>
            <HStack align="flex-start" spacing={2}>
                <IconButton aria-label="Arrastar para reordenar" size="xs" variant="ghost" mt={1}
                    icon={<GripVertical size={16} />} color={theme.textSecondary}
                    cursor="grab" sx={{ touchAction: 'none' }}
                    onPointerDown={(e) => dragControls.start(e)} />

                {branchCapable ? (
                    <IconButton aria-label="Expandir ou recolher" size="xs" variant="ghost" mt={1}
                        icon={collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                        onClick={() => onToggleCollapse(field.id)} color={theme.textSecondary} />
                ) : (
                    <Box w="24px" flexShrink={0} />
                )}

                <Box flex={1} minW={0}>
                    <FieldEditorItem
                        field={field} index={index} allFields={fields}
                        isDarkMode={isDarkMode} fieldTemplates={fieldTemplates}
                        hideConditional hideRemove
                        onUpdate={onUpdate} onTypeChange={onTypeChange}
                        onRemove={() => onRemoveSubtree(field.id)}
                        onAddOption={onAddOption} onUpdateOption={onUpdateOption}
                        onRemoveOption={onRemoveOption} onSelectOptionIcon={onSelectOptionIcon}
                        onOpenIconModal={onOpenIconModal}
                        onChangeFields={onChangeFields}
                    />
                </Box>

                <IconButton aria-label="Remover ramo" size="sm" colorScheme="red" variant="ghost"
                    mt={1} icon={<Trash2 size={16} />} onClick={() => onRemoveSubtree(field.id)} />
            </HStack>

            {branchCapable && !collapsed && (
                <VStack align="stretch" spacing={4} pl={5} ml={3} mt={3}
                    borderLeftWidth="2px" borderColor={theme.cardBorder}>
                    {node.branches.map(branch => (
                        <Box key={branch.option.value}>
                            <HStack mb={2} spacing={2}>
                                <Box color="blue.400"><Layers size={14} /></Box>
                                <Text fontSize="xs" fontWeight="bold" color={theme.textPrimary}
                                    textTransform="uppercase" letterSpacing="wide">
                                    {branch.option.label || branch.option.value}
                                </Text>
                                {branch.isOrphan && (
                                    <Text fontSize="10px" fontWeight="bold" color="orange.400">(órfã)</Text>
                                )}
                            </HStack>

                            {branch.children.length > 0 && (
                                <Reorder.Group as="div" axis="y"
                                    values={branch.children.map(c => c.field.uid ?? c.field.id)}
                                    onReorder={(order) => onReorderSiblings(uid, branch.option.value, order as string[])}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '0.5rem', listStyle: 'none' }}>
                                    {branch.children.map(child => (
                                        <FieldTreeNodeItem
                                            key={child.field.uid ?? child.field.id}
                                            node={child} depth={depth + 1}
                                            fields={fields} isDarkMode={isDarkMode} fieldTemplates={fieldTemplates}
                                            isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
                                            onAddChildUnderOption={onAddChildUnderOption} onRemoveSubtree={onRemoveSubtree}
                                            onReorderSiblings={onReorderSiblings}
                                            onUpdate={onUpdate} onTypeChange={onTypeChange}
                                            onAddOption={onAddOption} onUpdateOption={onUpdateOption}
                                            onRemoveOption={onRemoveOption} onSelectOptionIcon={onSelectOptionIcon}
                                            onOpenIconModal={onOpenIconModal}
                                            onChangeFields={onChangeFields}
                                        />
                                    ))}
                                </Reorder.Group>
                            )}

                            <HStack spacing={2}>
                                <Button size="xs" variant="outline" leftIcon={<Plus size={12} />}
                                    onClick={() => onAddChildUnderOption(field.id, branch.option.value, false)}
                                    color={theme.textPrimary} borderColor={theme.cardBorder}
                                    _hover={{ bg: theme.buttonBg }}>
                                    Campo
                                </Button>
                                <Button size="xs" variant="outline" leftIcon={<Plus size={12} />}
                                    onClick={() => onAddChildUnderOption(field.id, branch.option.value, true)}
                                    color={theme.textPrimary} borderColor={theme.cardBorder}
                                    _hover={{ bg: theme.buttonBg }}>
                                    Card aninhado
                                </Button>
                            </HStack>
                        </Box>
                    ))}
                </VStack>
            )}
        </Reorder.Item>
    );
};

// Identidade dos campos do subtree é estável entre teclas (só o campo editado ganha nova ref);
// `buildFieldTree` recria os nós, mas `node.field` referencia o objeto original. Comparando
// recursivamente as refs de campo, só o ramo que mudou re-renderiza. `fields` (prop) é ignorada
// de propósito — usada só para findIndex; quando o índice importa (mudança estrutural), as refs
// de campo mudam e o nó re-renderiza com `fields` fresco.
const sameNode = (a: FieldTreeNode, b: FieldTreeNode): boolean => {
    if (a.field !== b.field) return false;
    if (a.branches.length !== b.branches.length) return false;
    for (let i = 0; i < a.branches.length; i++) {
        const ba = a.branches[i];
        const bb = b.branches[i];
        if (ba.option.value !== bb.option.value || ba.option.label !== bb.option.label) return false;
        if (ba.children.length !== bb.children.length) return false;
        for (let j = 0; j < ba.children.length; j++) {
            if (!sameNode(ba.children[j], bb.children[j])) return false;
        }
    }
    return true;
};

const areEqual = (prev: FieldTreeNodeItemProps, next: FieldTreeNodeItemProps): boolean =>
    prev.depth === next.depth &&
    prev.isDarkMode === next.isDarkMode &&
    prev.fieldTemplates === next.fieldTemplates &&
    prev.isCollapsed === next.isCollapsed &&
    prev.onToggleCollapse === next.onToggleCollapse &&
    prev.onAddChildUnderOption === next.onAddChildUnderOption &&
    prev.onRemoveSubtree === next.onRemoveSubtree &&
    prev.onReorderSiblings === next.onReorderSiblings &&
    prev.onUpdate === next.onUpdate &&
    prev.onTypeChange === next.onTypeChange &&
    prev.onAddOption === next.onAddOption &&
    prev.onUpdateOption === next.onUpdateOption &&
    prev.onRemoveOption === next.onRemoveOption &&
    prev.onSelectOptionIcon === next.onSelectOptionIcon &&
    prev.onOpenIconModal === next.onOpenIconModal &&
    prev.onChangeFields === next.onChangeFields &&
    sameNode(prev.node, next.node);

export const FieldTreeNodeItem = memo(FieldTreeNodeItemComponent, areEqual);
