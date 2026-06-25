import { useState } from 'react';
import { Flex, Box, Text, Tooltip } from '@chakra-ui/react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import type { IconPreviewBoxProps } from '../../../types';

export const IconPreviewBox = ({ iconData, selectedIcon, isDarkMode, onSelect }: IconPreviewBoxProps) => {
    const theme = useMinimalTheme();
    const [isHovered, setIsHovered] = useState(false);
    const isCurrentlySelected = selectedIcon === iconData.value;
    const IconToRender = iconData.component;

    return (
        <Tooltip label={iconData.label} placement="top" hasArrow>
            <Flex
                direction="column" align="center" justify="center"
                p={4} borderWidth="2px" borderRadius="lg" cursor="pointer"
                transition="all 0.2s"
                bg={isCurrentlySelected ? (isDarkMode ? "blue.900" : "blue.50") : theme.cardBg}
                borderColor={isCurrentlySelected ? "blue.500" : theme.cardBorder}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => onSelect(iconData.value)}
                _hover={{
                    borderColor: isCurrentlySelected ? "blue.500" : theme.cardBorderHover,
                    bg: isCurrentlySelected ? undefined : theme.buttonBg
                }}
            >
                <Box color={isCurrentlySelected ? "blue.500" : theme.textPrimary}>
                    <IconToRender size={28} isHovered={isHovered} />
                </Box>
                <Text fontSize="xs" mt={3} color={theme.textSecondary}
                    textAlign="center" noOfLines={1} w="100%">
                    {iconData.label}
                </Text>
            </Flex>
        </Tooltip>
    );
};