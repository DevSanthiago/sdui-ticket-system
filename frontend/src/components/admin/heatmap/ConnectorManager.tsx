import { useState } from "react";
import { Box, VStack, HStack, Flex, Text, Button, Badge, IconButton } from "@chakra-ui/react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import { ThemedSelect } from "./ThemedSelect";
import type { PlantConnector } from "../../../types";
import type { PrefixOption } from "../../../hooks/admin/useHeatmapBoard";

interface ConnectorManagerProps {
    connectors: PlantConnector[];
    prefixes: PrefixOption[];
    isSubmitting: boolean;
    onAdd: (prefix: string | null) => void;
    onRemove: (id: number) => void;
}

export const ConnectorManager = ({ connectors, prefixes, isSubmitting, onAdd, onRemove }: ConnectorManagerProps) => {
    const theme = useMinimalTheme();
    const [prefix, setPrefix] = useState("");

    return (
        <Box p={5} bg={theme.cardBg} borderWidth="1px" borderColor={theme.cardBorder} borderRadius="xl">
            <VStack align="stretch" spacing={5}>
                <Box>
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary} mb={1}>
                        Adicionar conector
                    </Text>
                    <Text fontSize="xs" color={theme.textSecondary} mb={3}>
                        Conecte uma fonte de linhas de produção. As linhas viram cards no mapa
                        automaticamente e reagem aos chamados em aberto.
                    </Text>

                    <Flex gap={3} align="flex-end" flexWrap="wrap">
                        <Box minW="200px">
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>
                                Fonte
                            </Text>
                            <ThemedSelect value="1" onChange={() => { }} isDisabled>
                                <option value="1">Linhas de Produção</option>
                            </ThemedSelect>
                        </Box>
                        <Box minW="220px">
                            <Text fontSize="xs" fontWeight="bold" color={theme.textSecondary} mb={1}>
                                Escopo
                            </Text>
                            <ThemedSelect value={prefix} onChange={(e) => setPrefix(e.target.value)}>
                                <option value="">Todas as linhas da planta</option>
                                {prefixes.map((p) => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </ThemedSelect>
                        </Box>
                        <Button
                            leftIcon={<FiPlus />}
                            onClick={() => onAdd(prefix || null)}
                            isLoading={isSubmitting}
                            h="40px" size="sm" px={5}
                            bg={theme.textPrimary} color={theme.bgApp}
                            _hover={{ opacity: 0.85 }}>
                            Conectar
                        </Button>
                    </Flex>
                </Box>

                <Box>
                    <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary} mb={2}>
                        Conectores ativos ({connectors.length})
                    </Text>
                    {connectors.length === 0 ? (
                        <Text fontSize="xs" color={theme.textSecondary}>
                            Nenhum conector cadastrado.
                        </Text>
                    ) : (
                        <VStack align="stretch" spacing={2}>
                            {connectors.map((c) => (
                                <HStack key={c.id} justify="space-between"
                                    p={3} borderWidth="1px" borderColor={theme.cardBorder} borderRadius="lg">
                                    <HStack spacing={3}>
                                        <Text fontSize="sm" fontWeight="bold" color={theme.textPrimary}>
                                            Linhas de Produção
                                        </Text>
                                        <Badge colorScheme="green">
                                            {c.prefix ? (c.prefixLabel ?? c.prefix) : "Todas as linhas"}
                                        </Badge>
                                        <Text fontSize="xs" color={theme.textSecondary}>
                                            {c.lineCount} {c.lineCount === 1 ? "linha" : "linhas"}
                                        </Text>
                                    </HStack>
                                    <IconButton
                                        aria-label="Remover conector"
                                        icon={<FiTrash2 />}
                                        size="sm" variant="ghost" colorScheme="red"
                                        isDisabled={isSubmitting}
                                        onClick={() => onRemove(c.id)}
                                    />
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </Box>
            </VStack>
        </Box>
    );
};
