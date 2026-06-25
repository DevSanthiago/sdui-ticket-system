import { Box, VStack, HStack, Button, Text } from '@chakra-ui/react';
import { Reorder } from 'framer-motion';
import { Plus, Layers } from 'lucide-react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { FieldTreeNodeItem } from './FieldTreeNodeItem';
import type { FieldTreeViewProps } from '../../../types';

export const FieldTreeView = ({ nodes, onAddRoot, ...rest }: FieldTreeViewProps) => {
    const theme = useMinimalTheme();
    const rootUids = nodes.map(node => node.field.uid ?? node.field.id);

    return (
        <VStack align="stretch" spacing={4}>
            {nodes.length === 0 && (
                <Box textAlign="center" p={6} bg={theme.bgApp} borderRadius="lg"
                    borderStyle="dashed" borderWidth="1px" borderColor={theme.cardBorder}>
                    <Text color={theme.textSecondary}>Nenhum campo adicionado.</Text>
                </Box>
            )}

            <Reorder.Group as="div" axis="y" values={rootUids}
                onReorder={(order) => rest.onReorderSiblings(null, null, order as string[])}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none' }}>
                {nodes.map(node => (
                    <FieldTreeNodeItem key={node.field.uid ?? node.field.id} node={node} depth={0} {...rest} />
                ))}
            </Reorder.Group>

            <HStack spacing={2} pt={1}>
                <Button size="sm" variant="outline" leftIcon={<Plus size={14} />}
                    onClick={() => onAddRoot(false)} color={theme.textPrimary}
                    borderColor={theme.cardBorder} _hover={{ bg: theme.buttonBg }}>
                    Campo
                </Button>
                <Button size="sm" variant="outline" leftIcon={<Layers size={14} />}
                    onClick={() => onAddRoot(true)} color={theme.textPrimary}
                    borderColor={theme.cardBorder} _hover={{ bg: theme.buttonBg }}>
                    Card
                </Button>
            </HStack>
        </VStack>
    );
};
