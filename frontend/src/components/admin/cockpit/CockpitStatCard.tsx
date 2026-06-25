import React, { useState } from 'react';
import { Box, Flex, VStack, HStack, Text, Button, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import type { CockpitStatCardProps } from '../../../types';

export const CockpitStatCard = ({
    label, value, helpText, animatedIcon, actionLabel, onActionClick, loading
}: CockpitStatCardProps) => {
    const [cardHovered, setCardHovered] = useState(false);
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const activeBorder = isDarkMode ? "white" : "black";
    const activeShadow = isDarkMode ? "0 0 15px rgba(255, 255, 255, 0.4)" : "0 4px 15px rgba(0, 0, 0, 0.1)";
    const activeTextShadowStrong = isDarkMode ? "0 0 12px rgba(255, 255, 255, 0.8)" : "none";
    const activeTextShadowLight = isDarkMode ? "0 0 8px rgba(255, 255, 255, 0.5)" : "none";
    const activeIconShadow = isDarkMode ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))" : "none";

    return (
        <Box
            p={6} bg={theme.cardBg} borderRadius="xl" borderWidth="1px"
            display="flex" flexDirection="column" h="100%"
            borderColor={cardHovered ? activeBorder : theme.cardBorder}
            boxShadow={cardHovered ? activeShadow : "none"}
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.3s ease"
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
        >
            <Flex flex={1} justify="space-between" align="center" w="100%">
                <HStack spacing={4} align="center">
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Text fontSize={{ base: "5xl", md: "6xl" }} fontWeight="black"
                            lineHeight="1" color={theme.textPrimary} letterSpacing="tighter"
                            textShadow={cardHovered ? activeTextShadowStrong : "none"}
                            transition="text-shadow 0.3s ease">
                            {value}
                        </Text>
                    </Skeleton>
                    <VStack align="start" spacing={0} justify="center">
                        <Skeleton isLoaded={!loading} borderRadius="md">
                            <Text fontSize="md" fontWeight="extrabold" color={theme.textPrimary}
                                textShadow={cardHovered ? activeTextShadowLight : "none"}
                                transition="text-shadow 0.3s ease">
                                {label}
                            </Text>
                        </Skeleton>
                        <Skeleton isLoaded={!loading} borderRadius="md" mt={1}>
                            <Text fontSize="xs" color={theme.textSecondary} fontWeight="medium"
                                textShadow={cardHovered ? activeTextShadowLight : "none"}
                                transition="text-shadow 0.3s ease">
                                {helpText}
                            </Text>
                        </Skeleton>
                    </VStack>
                </HStack>

                <SkeletonCircle size="10" isLoaded={!loading}>
                    <Box color={theme.textPrimary}
                        filter={cardHovered ? activeIconShadow : "none"}
                        transition="filter 0.3s ease">
                        {animatedIcon && React.cloneElement(animatedIcon, { isHovered: cardHovered, size: 28 })}
                    </Box>
                </SkeletonCircle>
            </Flex>

            {actionLabel && (
                <Skeleton isLoaded={!loading} w="100%" mt={6} borderRadius="md">
                    <Button bg={theme.buttonBg} color={theme.textPrimary}
                        borderWidth="1px" borderColor={theme.cardBorder} size="sm"
                        onClick={onActionClick} w="100%"
                        _hover={{ bg: theme.buttonHoverBg }}>
                        {actionLabel}
                    </Button>
                </Skeleton>
            )}
        </Box>
    );
};