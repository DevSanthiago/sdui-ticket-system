import React, { useState } from 'react';
import { Box, VStack, HStack, Heading, Text, Button, Skeleton, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import { useMinimalTheme } from '../../../hooks/theme/useMinimalTheme';
import { useColorModeValue } from '../../../hooks/theme/useColorModeValue';
import type { AdminActionCardProps } from '../../../types';

export const AdminActionCard = ({
    title, description, animatedIcon, buttonText, onClick, loading
}: AdminActionCardProps) => {
    const [isActionHovered, setIsActionHovered] = useState(false);
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const activeBorder = isDarkMode ? "white" : "black";
    const activeShadow = isDarkMode ? "0 0 15px rgba(255, 255, 255, 0.4)" : "0 4px 15px rgba(0, 0, 0, 0.1)";
    const activeTextShadow = isDarkMode ? "0 0 8px rgba(255, 255, 255, 0.6)" : "none";
    const activeIconShadow = isDarkMode ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))" : "none";

    return (
        <Box
            p={4} bg={theme.cardBg} borderRadius="xl" borderWidth="1px"
            display="flex" flexDirection="column"
            borderColor={isActionHovered ? activeBorder : theme.cardBorder}
            boxShadow={isActionHovered ? activeShadow : "none"}
            _hover={{ transform: "translateY(-4px)" }}
            transition="all 0.3s ease"
            onMouseEnter={() => setIsActionHovered(true)}
            onMouseLeave={() => setIsActionHovered(false)}
        >
            <VStack align="start" spacing={3} flex={1}>
                <HStack>
                    <SkeletonCircle size="6" isLoaded={!loading}>
                        <Box color={theme.iconColor}
                            filter={isActionHovered ? activeIconShadow : "none"}
                            transition="filter 0.3s ease">
                            {React.cloneElement(animatedIcon, { isHovered: isActionHovered })}
                        </Box>
                    </SkeletonCircle>
                    <Skeleton isLoaded={!loading} borderRadius="md">
                        <Heading size="sm" color={theme.textPrimary}
                            textShadow={isActionHovered ? activeTextShadow : "none"}
                            transition="text-shadow 0.3s ease">
                            {title}
                        </Heading>
                    </Skeleton>
                </HStack>

                <SkeletonText isLoaded={!loading} noOfLines={2} spacing="2" w="100%">
                    <Text color={theme.textSecondary} fontSize="sm"
                        textShadow={isActionHovered ? activeTextShadow : "none"}
                        transition="text-shadow 0.3s ease">
                        {description}
                    </Text>
                </SkeletonText>

                <Skeleton isLoaded={!loading} w="100%" mt="auto" borderRadius="md">
                    <Button bg={theme.buttonBg} color={theme.textPrimary}
                        borderWidth="1px" borderColor={theme.cardBorder} size="sm"
                        onClick={onClick} w="100%"
                        _hover={{ bg: theme.buttonHoverBg }}>
                        {buttonText}
                    </Button>
                </Skeleton>
            </VStack>
        </Box>
    );
};