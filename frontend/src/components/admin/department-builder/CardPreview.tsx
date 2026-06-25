import { useState } from 'react';
import { Box, Flex, Text, HStack, Badge } from '@chakra-ui/react';
import type { AnimatedIconProps, CardData } from '../../../types';
import type { ElementType } from 'react';

interface CardPreviewProps {
    data: CardData;
    badges: string[];
    activeThemeColor: string;
    monochromeColor: string;
    cardBg: string;
    textSecondary: string;
    badgeBorder: string;
    SelectedIcon: ElementType<AnimatedIconProps>;
}

export const CardPreview = ({
    data,
    badges,
    activeThemeColor,
    monochromeColor,
    cardBg,
    textSecondary,
    badgeBorder,
    SelectedIcon,
}: CardPreviewProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const defaultBorderColor = 'rgba(255,255,255,0.15)';
    const defaultIconBg = 'rgba(255,255,255,0.05)';
    const defaultBadgeColor = 'rgba(255,255,255,0.5)';
    const defaultBadgeBorder = 'rgba(255,255,255,0.2)';

    return (
        <>
            <style>{`
                @property --preview-card-angle {
                    syntax: "<angle>";
                    initial-value: 0deg;
                    inherits: false;
                }
                @keyframes drawPreviewCardBorder {
                    to { --preview-card-angle: 360deg; }
                }
            `}</style>
            <Box
                w="100%" maxW="380px" h="150px" bg={cardBg}
                borderRadius="2xl" display="flex" alignItems="center"
                cursor="pointer" p={5} gap={5}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative" overflow="hidden"
                borderWidth="1px" borderStyle="solid" borderColor={defaultBorderColor}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                _hover={{ shadow: `0 8px 32px -10px ${activeThemeColor}80`, transform: "translateY(-2px)", borderColor: "transparent" }}
                _before={{
                    content: '""', position: "absolute", inset: "-150%",
                    transition: "opacity 0.2s ease", opacity: isHovered ? 1 : 0, zIndex: 1,
                    background: `conic-gradient(from 0deg, ${activeThemeColor} 0deg, ${activeThemeColor} var(--preview-card-angle), transparent var(--preview-card-angle))`,
                    animation: isHovered ? "drawPreviewCardBorder 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
                }}
                _after={{
                    content: '""', position: "absolute", inset: "2px", bg: cardBg,
                    borderRadius: "calc(1rem - 1px)", zIndex: 2,
                    boxShadow: isHovered ? `inset 0 0 0 500px ${activeThemeColor}15` : "inset 0 0 0 500px transparent",
                    transition: "all 0.3s ease",
                }}
            >
                <Flex
                    w="64px" h="64px" align="center" justify="center"
                    borderRadius="xl" borderWidth="1px" flexShrink={0} zIndex={3}
                    transition="all 0.3s ease"
                    borderColor={isHovered ? `${activeThemeColor}40` : defaultBorderColor}
                    bg={isHovered ? `${activeThemeColor}15` : defaultIconBg}
                >
                    <SelectedIcon
                        size={36}
                        isHovered={isHovered}
                        color={isHovered ? activeThemeColor : monochromeColor}
                    />
                </Flex>

                <Flex direction="column" justify="center" flex={1} overflow="hidden" h="100%" zIndex={3}>
                    <Text fontSize="lg" fontWeight="bold" mb={1} noOfLines={1} transition="all 0.3s ease"
                        color={isHovered ? activeThemeColor : monochromeColor}>
                        {data.name || "Nome do Departamento"}
                    </Text>
                    <Text fontSize="sm" color={textSecondary} mb={4} noOfLines={2}>
                        {data.description || "Descrição breve sobre as ações e tickets deste departamento."}
                    </Text>
                    <HStack flexWrap="nowrap" overflow="hidden" w="full" spacing={2} mt="auto">
                        {badges.slice(0, 3).map((b, i) => (
                            <Badge key={i} bg="transparent" px={2} py={0.5} borderRadius="full"
                                textTransform="uppercase" fontSize="2xs" whiteSpace="nowrap"
                                transition="all 0.3s ease" borderWidth="1px"
                                color={isHovered ? activeThemeColor : defaultBadgeColor}
                                borderColor={isHovered ? activeThemeColor : defaultBadgeBorder}>
                                {b}
                            </Badge>
                        ))}
                        {badges.length === 0 && (
                            <Badge bg="transparent" color={textSecondary} borderColor={badgeBorder}
                                borderWidth="1px" px={2} py={0.5} borderRadius="full"
                                textTransform="uppercase" fontSize="2xs" opacity={0.5} whiteSpace="nowrap">
                                Ex: Produção
                            </Badge>
                        )}
                    </HStack>
                </Flex>
            </Box>
        </>
    );
};