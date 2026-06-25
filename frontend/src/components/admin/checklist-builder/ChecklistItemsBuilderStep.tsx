import { useState } from 'react';
import {
    Box, Flex, Heading, HStack, VStack, Button, Text, Input, IconButton, Checkbox, Badge
} from '@chakra-ui/react';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import { StaticFileText } from '../../icons/StaticIcons';
import * as AnimatedIcons from '../../icons/NewAnimatedIcons';
import type { ChecklistItemsBuilderStepProps, ChecklistItemSchema } from '../../../types';

const createItem = (label = ''): ChecklistItemSchema => ({
    id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? `item_${crypto.randomUUID()}`
        : `item_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    label,
});

export const ChecklistItemsBuilderStep = ({ items, onChange, checklistName }: ChecklistItemsBuilderStepProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const [isAddHovered, setIsAddHovered] = useState(false);

    const handleAddItem = () => onChange([...items, createItem()]);

    const handleUpdateItem = (index: number, label: string) => {
        const next = [...items];
        next[index] = { ...next[index], label };
        onChange(next);
    };

    const handleRemoveItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const handleMove = (index: number, direction: -1 | 1) => {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    return (
        <Flex gap={6} direction={{ base: 'column', lg: 'row' }} h={{ base: 'auto', lg: '500px' }} w="100%">
            <Flex flex={1} bg={theme.cardBg} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
                <Box w="100%" pt={5} px={5} bg={theme.cardBg} zIndex={1}>
                    <Flex justify="space-between" align="center" pb={3}
                        borderBottomWidth="1px" borderColor={theme.cardBorder}>
                        <HStack>
                            <Box color={theme.iconColor} display="flex"><StaticFileText size={20} /></Box>
                            <Heading size="sm" color={theme.textPrimary}>Itens de Verificação</Heading>
                        </HStack>
                        <Button
                            leftIcon={<AnimatedIcons.AnimatedPlus size={16} isHovered={isAddHovered} />}
                            bg={isDarkMode ? 'white' : 'black'}
                            color={isDarkMode ? 'black' : 'white'}
                            _hover={{ bg: isDarkMode ? 'gray.200' : 'gray.800' }}
                            size="sm" onClick={handleAddItem}
                            onMouseEnter={() => setIsAddHovered(true)}
                            onMouseLeave={() => setIsAddHovered(false)}>
                            Novo Item
                        </Button>
                    </Flex>
                </Box>

                <Box flex={1} w="100%" p={5} overflowY="auto"
                    css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <VStack spacing={3} align="stretch">
                        {items.length === 0 && (
                            <Box textAlign="center" p={6} bg={theme.bgApp} borderRadius="lg"
                                borderStyle="dashed" borderWidth="1px" borderColor={theme.cardBorder}>
                                <Text color={theme.textSecondary}>Nenhum item adicionado. Clique em "Novo Item".</Text>
                            </Box>
                        )}
                        {items.map((item, index) => (
                            <HStack key={item.id} spacing={2} align="center">
                                <Badge minW="32px" textAlign="center" colorScheme="gray" borderRadius="md" py={1}>
                                    {index + 1}
                                </Badge>
                                <Input
                                    flex={1} size="sm" borderRadius="md"
                                    placeholder="Descreva o item de verificação..."
                                    value={item.label}
                                    onChange={(e) => handleUpdateItem(index, e.target.value)}
                                    bg={theme.buttonBg} borderColor={theme.cardBorder} color={theme.textPrimary}
                                    _focus={{ borderColor: isDarkMode ? 'white' : 'black', boxShadow: 'none' }}
                                />
                                <IconButton aria-label="Mover para cima" icon={<FaArrowUp />} size="sm"
                                    variant="ghost" color={theme.textSecondary} isDisabled={index === 0}
                                    _hover={{ bg: theme.buttonHoverBg }} onClick={() => handleMove(index, -1)} />
                                <IconButton aria-label="Mover para baixo" icon={<FaArrowDown />} size="sm"
                                    variant="ghost" color={theme.textSecondary} isDisabled={index === items.length - 1}
                                    _hover={{ bg: theme.buttonHoverBg }} onClick={() => handleMove(index, 1)} />
                                <IconButton aria-label="Remover item" icon={<FaTrash />} size="sm"
                                    variant="ghost" colorScheme="red"
                                    _hover={{ bg: 'red.500', color: 'white' }} onClick={() => handleRemoveItem(index)} />
                            </HStack>
                        ))}
                    </VStack>
                </Box>
            </Flex>

            <Flex flex={1} bg={theme.bgApp} p={5} borderRadius="xl" borderWidth="1px"
                borderColor={theme.cardBorder} shadow="sm" direction="column" h="100%" overflow="hidden">
                <HStack w="100%" mb={4} pb={3} borderBottomWidth="1px" borderColor={theme.cardBorder}>
                    <Box color={theme.iconColor} display="flex"><AnimatedIcons.AnimatedClipboardCheck size={20} /></Box>
                    <Heading size="sm" color={theme.textPrimary}>Pré-visualização</Heading>
                </HStack>
                <Box flex={1} w="100%" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: '4px' } }}>
                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color={theme.textSecondary} mb={3}>
                        {checklistName || 'Novo Checklist'} — Itens
                    </Text>
                    {items.length === 0 ? (
                        <Text color={theme.textSecondary} fontSize="sm">Os itens aparecerão aqui conforme você adiciona.</Text>
                    ) : (
                        <VStack align="stretch" spacing={2}>
                            {items.map((item) => (
                                <Checkbox key={item.id} colorScheme="green" isReadOnly isChecked={false}>
                                    <Text fontSize="sm" color={theme.textPrimary}>{item.label || '(sem descrição)'}</Text>
                                </Checkbox>
                            ))}
                        </VStack>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};
