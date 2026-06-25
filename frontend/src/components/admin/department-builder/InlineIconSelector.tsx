import { useState, useMemo } from 'react';
import { Box, HStack, Text, IconButton, Tooltip } from '@chakra-ui/react';
import { ArrowRight, ArrowLeft, Search } from 'lucide-react';
import { iconOptions } from '../../../constants/icons/iconOptions';
import type { AnimatedIconKey } from '../../../types';

interface InlineIconSelectorProps {
    selectedIconName: string;
    cardBorder: string;
    bgApp: string;
    textSecondary: string;
    isDarkMode: boolean;
    onSelect: (iconName: AnimatedIconKey) => void;
    onOpenModal: () => void;
}

export const InlineIconSelector = ({
    selectedIconName,
    cardBorder,
    bgApp,
    textSecondary,
    isDarkMode,
    onSelect,
    onOpenModal,
}: InlineIconSelectorProps) => {
    const [iconPage, setIconPage] = useState(0);
    const iconsPerPage = 7;
    const totalPages = Math.ceil(iconOptions.length / iconsPerPage);

    const currentIcons = useMemo(() => {
        const start = iconPage * iconsPerPage;
        return iconOptions.slice(start, start + iconsPerPage);
    }, [iconPage]);

    return (
        <Box mt={4} pt={4} borderTopWidth="1px" borderColor={cardBorder}>
            <HStack justify="space-between" mb={2}>
                <Text fontSize="xs" fontWeight="bold" color={textSecondary}>
                    Selecione o ícone do card
                </Text>
                <HStack spacing={2}>
                    <IconButton size="xs" aria-label="Anterior" icon={<ArrowLeft size={14} />}
                        isDisabled={iconPage === 0} onClick={() => setIconPage(p => p - 1)} />
                    <Text fontSize="xs" color={textSecondary}>{iconPage + 1} / {totalPages}</Text>
                    <IconButton size="xs" aria-label="Próximo" icon={<ArrowRight size={14} />}
                        isDisabled={iconPage === totalPages - 1} onClick={() => setIconPage(p => p + 1)} />
                </HStack>
            </HStack>
            <HStack spacing={2} justify="space-between" bg={bgApp} p={2}
                borderRadius="lg" borderWidth="1px" borderColor={cardBorder}>
                {currentIcons.map((icon) => {
                    const IconComp = icon.component;
                    const isSelected = selectedIconName === icon.value;
                    return (
                        <Tooltip key={icon.value} label={icon.label} hasArrow>
                            <Box p={2} cursor="pointer" borderRadius="md" borderWidth="2px"
                                transition="all 0.2s"
                                borderColor={isSelected ? "blue.500" : "transparent"}
                                bg={isSelected ? (isDarkMode ? "blue.900" : "blue.50") : "transparent"}
                                onClick={() => onSelect(icon.value as AnimatedIconKey)}
                                _hover={{ bg: isSelected ? undefined : cardBorder }}>
                                <IconComp size={20} isHovered={isSelected} />
                            </Box>
                        </Tooltip>
                    );
                })}
                <Tooltip label="Ver todos">
                    <IconButton variant="ghost" aria-label="Pesquisar ícones"
                        icon={<Search size={18} />} onClick={onOpenModal} />
                </Tooltip>
            </HStack>
        </Box>
    );
};