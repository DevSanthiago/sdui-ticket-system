import React, { useState } from 'react';
import { Box, Flex, VStack, Text, Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { useMinimalTheme } from '../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../hooks/theme/useColorModeValue';
import type { DashboardStatCardProps } from '../../types';

export const StatCard = React.memo(({
    label, value, animatedIcon, loading, helpText
}: DashboardStatCardProps) => {
    const [cardHovered, setCardHovered] = useState(false);
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const activeBorder = isDarkMode ? "white" : "black";
    const activeShadow = isDarkMode ? "0 0 15px rgba(255, 255, 255, 0.4)" : "0 4px 15px rgba(0, 0, 0, 0.1)";
    const activeIconShadow = isDarkMode ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))" : "none";

    return (
        <Box
            bg={theme.cardBg} p={5} borderRadius="2xl" borderWidth="1px"
            position="relative" overflow="hidden"
            borderColor={cardHovered ? activeBorder : theme.cardBorder}
            boxShadow={cardHovered ? activeShadow : "none"}
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.3s ease"
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={() => setCardHovered(false)}
        >
            <Flex justify="space-between" align="center" w="100%">
                <VStack align="start" spacing={1} flex={1}>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase"
                            letterSpacing="wider" color={theme.textSecondary}>
                            {label}
                        </Text>
                    </Skeleton>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Text fontSize="3xl" fontWeight="black"
                            color={theme.textPrimary} letterSpacing="tighter">
                            {value}
                        </Text>
                    </Skeleton>
                    {helpText && (
                        <Skeleton isLoaded={!loading} borderRadius="md" mt={1}>
                            <Text fontSize="10px" color={theme.textSecondary} fontStyle="italic">
                                {helpText}
                            </Text>
                        </Skeleton>
                    )}
                </VStack>
                {animatedIcon && (
                    <SkeletonCircle size="10" isLoaded={!loading} ml={2}>
                        <Box
                            color={theme.iconColor} display="flex"
                            alignItems="center" justifyContent="center"
                            filter={cardHovered ? activeIconShadow : "none"}
                            transition="filter 0.3s ease"
                        >
                            {React.cloneElement(animatedIcon, { isHovered: cardHovered, size: 32 })}
                        </Box>
                    </SkeletonCircle>
                )}
            </Flex>
        </Box>
    );
});

StatCard.displayName = "StatCard";