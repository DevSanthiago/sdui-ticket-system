import { useState } from "react";
import { Box, Text, Flex, Badge, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import type { ActionCardProps } from "../../types";

export const ActionCard = ({
    title, description, badges = [],
    cardColorHex, icon: AnimatedIcon,
    onClick, isLoading
}: ActionCardProps) => {
    const theme = useMinimalTheme();
    const [isHovered, setIsHovered] = useState(false);

    const constructorColor = cardColorHex || '#4083ff';
    const monochromeColor = useColorModeValue("black", "white");
    const defaultBorderColor = useColorModeValue("rgba(0, 0, 0, 0.1)", "rgba(255, 255, 255, 0.15)");
    const defaultIconBg = useColorModeValue("rgba(0, 0, 0, 0.03)", "rgba(255, 255, 255, 0.05)");
    const defaultBadgeColor = useColorModeValue("rgba(0, 0, 0, 0.6)", "rgba(255, 255, 255, 0.5)");
    const defaultBadgeBorder = useColorModeValue("rgba(0, 0, 0, 0.2)", "rgba(255, 255, 255, 0.2)");

    if (isLoading) {
        return (
            <Flex w="100%" h="150px" bg={theme.cardBg} borderRadius="2xl"
                p={5} gap={5} alignItems="center" borderWidth="1px"
                borderStyle="solid" borderColor={defaultBorderColor}>
                <Skeleton w="64px" h="64px" borderRadius="xl" flexShrink={0} />
                <Flex direction="column" justify="center" flex={1}
                    overflow="hidden" h="100%" textAlign="left">
                    <Skeleton height="18px" width="70%" mb={3} borderRadius="md" />
                    <SkeletonText noOfLines={2} spacing="2" skeletonHeight="12px" mb={4} />
                    <HStack spacing={2} mt="auto">
                        <Skeleton height="18px" width="50px" borderRadius="full" />
                        <Skeleton height="18px" width="60px" borderRadius="full" />
                        <Skeleton height="18px" width="70px" borderRadius="full" />
                    </HStack>
                </Flex>
            </Flex>
        );
    }

    return (
        <>
            <style>{`
                @property --card-angle {
                    syntax: "<angle>";
                    initial-value: 0deg;
                    inherits: false;
                }
                @keyframes drawCardBorder {
                    to { --card-angle: 360deg; }
                }
            `}</style>
            <Box
                as="button" onClick={onClick} w="100%" h="150px"
                bg={theme.cardBg} borderRadius="2xl" display="flex"
                alignItems="center" cursor="pointer" p={5} gap={5}
                position="relative" overflow="hidden"
                borderWidth="1px" borderStyle="solid" borderColor={defaultBorderColor}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                _hover={{
                    shadow: `0 8px 32px -10px ${constructorColor}80`,
                    transform: "translateY(-4px) scale(1.01)",
                    borderColor: "transparent",
                }}
                _before={{
                    content: '""', position: "absolute", inset: "-150%",
                    transition: "opacity 0.2s ease", opacity: isHovered ? 1 : 0, zIndex: 1,
                    background: `conic-gradient(from 0deg, ${constructorColor} 0deg, ${constructorColor} var(--card-angle), transparent var(--card-angle))`,
                    animation: isHovered ? "drawCardBorder 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
                }}
                _after={{
                    content: '""', position: "absolute", inset: "2px",
                    bg: theme.cardBg, borderRadius: "calc(1rem - 1px)", zIndex: 2,
                    boxShadow: isHovered ? `inset 0 0 0 500px ${constructorColor}15` : "inset 0 0 0 500px transparent",
                    transition: "all 0.3s ease",
                }}
            >
                <Flex w="64px" h="64px" align="center" justify="center"
                    borderRadius="xl" borderWidth="1px" flexShrink={0} zIndex={3}
                    transition="all 0.3s ease"
                    borderColor={isHovered ? `${constructorColor}40` : defaultBorderColor}
                    bg={isHovered ? `${constructorColor}15` : defaultIconBg}>
                    {AnimatedIcon ? (
                        <AnimatedIcon
                            size={36} isHovered={isHovered}
                            color={isHovered ? constructorColor : monochromeColor}
                        />
                    ) : (
                        <Box w="36px" h="36px" />
                    )}
                </Flex>

                <Flex direction="column" justify="center" flex={1}
                    overflow="hidden" h="100%" textAlign="left" zIndex={3}>
                    <Text fontSize="lg" fontWeight="bold" mb={1} noOfLines={1}
                        transition="all 0.3s ease"
                        color={isHovered ? constructorColor : monochromeColor}>
                        {title}
                    </Text>
                    <Text fontSize="sm" color={theme.textSecondary} mb={4} noOfLines={2}>
                        {description}
                    </Text>
                    <HStack flexWrap="nowrap" overflow="hidden" w="full" spacing={2} mt="auto">
                        {badges.slice(0, 3).map((b, i) => (
                            <Badge key={i} bg="transparent" borderWidth="1px"
                                px={2} py={0.5} borderRadius="full"
                                textTransform="uppercase" fontSize="2xs"
                                whiteSpace="nowrap" transition="all 0.3s ease"
                                color={isHovered ? constructorColor : defaultBadgeColor}
                                borderColor={isHovered ? constructorColor : defaultBadgeBorder}>
                                {b}
                            </Badge>
                        ))}
                    </HStack>
                </Flex>
            </Box>
        </>
    );
};