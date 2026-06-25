import { Box, VStack, Text, HStack, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "../../hooks/theme/useColorModeValue";
import { useMinimalTheme } from "../../hooks/theme/useMinimalTheme";
import { useSidebar } from "../../hooks/layout/useSidebar";

interface InternalSidebarItemProps {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    isSidebarExpanded: boolean;
    onClick: () => void;
    showBadge?: boolean;
}

const SidebarItem = ({ icon: IconComponent, label, isActive, isSidebarExpanded, onClick, showBadge }: InternalSidebarItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const theme = useMinimalTheme();

    const activeBg = useColorModeValue("black", "white");
    const activeColor = useColorModeValue("white", "black");
    const neonGlow = useColorModeValue(
        "0 0 12px rgba(0, 0, 0, 0.3)",
        "0 0 12px rgba(255, 255, 255, 0.5)"
    );

    return (
        <Box w="100%">
            <HStack
                w="calc(100% - 16px)" mx="auto"
                justifyContent={isSidebarExpanded ? "flex-start" : "center"}
                pl={isSidebarExpanded ? 4 : 0} pr={isSidebarExpanded ? 4 : 0}
                my={1} h="48px" cursor="pointer"
                bg={isActive ? activeBg : "transparent"}
                color={isActive ? activeColor : theme.textSecondary}
                boxShadow={isActive ? neonGlow : "none"}
                _hover={{
                    bg: isActive ? activeBg : theme.buttonHoverBg,
                    color: isActive ? activeColor : theme.textPrimary,
                    transform: isActive ? "none" : "translateX(4px)"
                }}
                borderRadius="xl"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                overflow="hidden" whiteSpace="nowrap" alignItems="center" position="relative"
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box w="24px" display="flex" justifyContent="center" flexShrink={0} position="relative" pointerEvents="none">
                    <IconComponent size={24} isHovered={isHovered || isActive} />
                    {showBadge && !isSidebarExpanded && (
                        <Box position="absolute" top="-2px" right="-2px" w="9px" h="9px"
                            bg="red.500" borderRadius="full" boxShadow="0 0 6px rgba(239,68,68,0.8)" />
                    )}
                </Box>

                <Flex
                    display={isSidebarExpanded ? "flex" : "none"}
                    align="center" justify="space-between" flex={1}
                    overflow="hidden" opacity={isSidebarExpanded ? 1 : 0} transition="opacity 0.2s"
                >
                    <Text ml={4} fontWeight={isActive ? "bold" : "medium"} pr={3} flex={1}>
                        {label}
                    </Text>
                    {showBadge && (
                        <Box w="8px" h="8px" bg="red.500" borderRadius="full"
                            boxShadow="0 0 6px rgba(239,68,68,0.8)" flexShrink={0} />
                    )}
                </Flex>
            </HStack>
        </Box>
    );
};

interface SidebarMenuListProps {
    expanded: boolean;
    onNavigate?: () => void;
}

export const SidebarMenuList = ({ expanded, onNavigate }: SidebarMenuListProps) => {
    const {
        visibleMenuItems, currentPath, checkIsActive, handleNavigation, hasPendingChecklist
    } = useSidebar();

    return (
        <VStack gap={2} p={0} py={4} align="start" w="100%">
            {visibleMenuItems.map((item) => (
                <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={checkIsActive(item, currentPath)}
                    isSidebarExpanded={expanded}
                    onClick={() => { handleNavigation(item.path); onNavigate?.(); }}
                    showBadge={item.id === 'inbox' && hasPendingChecklist}
                />
            ))}
        </VStack>
    );
};

export const Sidebar = () => {
    const { isExpanded, setIsExpanded, sidebarBg, borderRight, theme } = useSidebar();

    return (
        <Box
            h="calc(100vh - 60px)"
            bg={sidebarBg}
            borderRight={borderRight}
            borderColor={theme.cardBorder}
            color={theme.textPrimary}
            w={isExpanded ? "280px" : "60px"}
            transition="width 0.3s cubic-bezier(0.2, 0, 0, 1)"
            position="fixed" left={0} zIndex={10} boxShadow="xl"
            overflowX="hidden" overflowY="auto"
            css={{
                '&::-webkit-scrollbar': { display: 'none' },
                'scrollbarWidth': 'none'
            }}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <SidebarMenuList expanded={isExpanded} />
        </Box>
    );
};