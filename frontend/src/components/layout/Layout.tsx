import {
    Box, Flex, HStack, IconButton, Spacer, Text, Image, Menu, MenuButton, MenuList, MenuItem, MenuDivider, VStack,
    useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerBody
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, SidebarMenuList } from "./Sidebar";
import { RoleBadge } from "./RoleBadge";
import { useLayout } from "../../hooks/layout/useLayout";
import { useChecklistRealtime } from "../../hooks/checklist/useChecklistRealtime";
import { useTicketNotifications } from "../../hooks/notifications/useTicketNotifications";
import { NotificationSoundMenu } from "../notifications/NotificationSoundMenu";
import { KioskControlMenu } from "../kiosk/KioskControlMenu";
import { KioskAndonView } from "../kiosk/KioskAndonView";
import { KioskHeatmapView } from "../kiosk/KioskHeatmapView";
import { useKioskView } from "../../hooks/kiosk/useKioskView";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";

import {
    AnimatedUser, AnimatedSun, AnimatedSunMoon, AnimatedArrowBigLeftDash, AnimatedMapPinHouse, AnimatedEarth
} from "../icons/NewAnimatedIcons";
import logoImg from "../../assets/img/new-logo-transparent-branding.svg";

export const Layout = () => {
    const {
        isDark, fullUser, userName, greeting, primaryRole,
        plants, activePlantId, footerColor, footerBorderColor,
        isThemeHovered, setIsThemeHovered,
        isProfileHovered, setIsProfileHovered,
        isLogoutHovered, setIsLogoutHovered,
        isPlantHovered, setIsPlantHovered,
        isPlantMenuOpen, togglePlantMenu, plantMenuRef,
        toggleColorMode, handlePlantSelect, handleLogout, handleExitKiosk
    } = useLayout();

    const location = useLocation();
    const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
    const isKiosk = localStorage.getItem(STORAGE_KEYS.KIOSK) === "true";
    const { view: kioskView, setView: setKioskView } = useKioskView();

    useChecklistRealtime(!isKiosk);
    useTicketNotifications();

    if (isKiosk) {
        if (location.pathname !== "/tickets/board") {
            return <Navigate to="/tickets/board" replace />;
        }

        return (
            <Box h="100dvh" bg={isDark ? "black" : "gray.50"} overflow="hidden" position="relative">
                {kioskView === "andon" ? (
                    <KioskAndonView />
                ) : kioskView === "heatmap" ? (
                    <KioskHeatmapView />
                ) : (
                    <Outlet />
                )}
                <Box position="fixed" bottom={6} right={6} zIndex={50}>
                    <KioskControlMenu
                        isDark={isDark}
                        currentView={kioskView}
                        onSelectView={setKioskView}
                        onExit={handleExitKiosk}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box h="100dvh" bg={isDark ? "black" : "gray.50"} transition="background 0.2s" overflow="hidden">
            <Flex
                as="header"
                h="70px"
                bg={isDark ? "black" : "white"}
                align="center"
                px={{ base: 3, md: 6 }}
                color={isDark ? "white" : "gray.800"}
                position="sticky"
                top={0}
                zIndex={20}
                shadow="sm"
                transition="background 0.2s"
                borderBottom="1px solid"
                borderColor={isDark ? "whiteAlpha.200" : "gray.200"}
                flexShrink={0}
            >
                <HStack gap={{ base: 2, md: 4 }} minW={0}>
                    <IconButton
                        aria-label="Abrir menu"
                        icon={<FiMenu size={22} />}
                        onClick={onMenuOpen}
                        variant="ghost"
                        color={isDark ? "white" : "gray.700"}
                        display={{ base: "inline-flex", md: "none" }}
                        _hover={{ bg: isDark ? "whiteAlpha.200" : "gray.100" }}
                    />
                    <Image
                        src={logoImg}
                        alt="Logo Ticket System"
                        h={{ base: "34px", md: "45px" }}
                        objectFit="contain"
                        filter={isDark ? "none" : "invert(1)"}
                    />
                    <Box h="30px" w="1px" bg={isDark ? "whiteAlpha.400" : "gray.300"} display={{ base: "none", md: "block" }} />
                    <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color={isDark ? "whiteAlpha.900" : "gray.600"}
                        noOfLines={1}
                    >
                        {greeting}, <Text as="span" fontWeight="bold" color={isDark ? "white" : "black"}>{userName}</Text>
                    </Text>
                </HStack>

                <Spacer />

                <HStack gap={{ base: 1, md: 4 }}>
                    <Box mr={2} display={{ base: "none", md: "block" }}>
                        <Box position="relative" ref={plantMenuRef}>
                            <IconButton
                                aria-label="Escolher planta"
                                variant="ghost"
                                size="sm"
                                color={isDark ? "whiteAlpha.900" : "gray.700"}
                                filter={isDark ? "drop-shadow(0 0 7px rgba(255, 255, 255, 0.5))" : "none"}
                                _hover={{
                                    bg: isDark ? "whiteAlpha.200" : "gray.100",
                                    filter: isDark ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))" : "none"
                                }}
                                onClick={togglePlantMenu}
                                onMouseEnter={() => setIsPlantHovered(true)}
                                onMouseLeave={() => setIsPlantHovered(false)}
                                icon={<AnimatedEarth size={22} isHovered={isPlantHovered || isPlantMenuOpen} />}
                            />

                            <AnimatePresence>
                                {isPlantMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                        style={{ position: "absolute", top: "44px", right: 0, transformOrigin: "top right", zIndex: 30 }}
                                    >
                                        <Box
                                            minW="240px"
                                            bg={isDark ? "black" : "white"}
                                            borderWidth="1px"
                                            borderColor={isDark ? "gray.700" : "gray.200"}
                                            borderRadius="xl"
                                            overflow="hidden"
                                            boxShadow={isDark ? "0 0 20px rgba(255,255,255,0.08)" : "lg"}
                                        >
                                            <Box px={4} py={3} borderBottomWidth="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
                                                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={isDark ? "gray.400" : "gray.500"}>
                                                    Escolha a sua filial
                                                </Text>
                                            </Box>
                                            <VStack align="stretch" spacing={0} py={1}>
                                                {plants.map(p => {
                                                    const isActivePlant = p.id.toString() === activePlantId;
                                                    return (
                                                        <HStack
                                                            key={p.id}
                                                            px={4} py={2.5} spacing={2.5} cursor="pointer"
                                                            bg={isActivePlant ? (isDark ? "whiteAlpha.200" : "gray.100") : "transparent"}
                                                            color={isDark ? "whiteAlpha.900" : "gray.800"}
                                                            _hover={{ bg: isDark ? "whiteAlpha.300" : "gray.200" }}
                                                            transition="background 0.15s ease"
                                                            onClick={() => handlePlantSelect(p.id)}
                                                        >
                                                            <AnimatedMapPinHouse size={16} isHovered={false} />
                                                            <Text fontSize="sm" fontWeight={isActivePlant ? "bold" : "medium"}>{p.name}</Text>
                                                        </HStack>
                                                    );
                                                })}
                                            </VStack>
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    </Box>

                    <Box display={{ base: "none", md: "block" }}>
                        <NotificationSoundMenu isDark={isDark} />
                    </Box>

                    <IconButton
                        aria-label="Toggle theme"
                        variant="ghost"
                        color={isDark ? "white" : "gray.600"}
                        filter={isDark ? "drop-shadow(0 0 7px rgba(255, 255, 255, 0.5))" : "none"}
                        _hover={{
                            bg: isDark ? "whiteAlpha.200" : "gray.100",
                            filter: isDark ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))" : "none"
                        }}
                        onClick={toggleColorMode}
                        onMouseEnter={() => setIsThemeHovered(true)}
                        onMouseLeave={() => setIsThemeHovered(false)}
                        icon={isDark ? <AnimatedSun isHovered={isThemeHovered} /> : <AnimatedSunMoon isHovered={isThemeHovered} />}
                    />

                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Profile"
                            variant="ghost"
                            color={isDark ? "white" : "gray.600"}
                            filter={isDark ? "drop-shadow(0 0 7px rgba(255, 255, 255, 0.5))" : "none"}
                            _hover={{
                                bg: isDark ? "whiteAlpha.200" : "gray.100",
                                filter: isDark ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))" : "none"
                            }}
                            _active={{ bg: isDark ? "whiteAlpha.300" : "gray.200" }}
                            onMouseEnter={() => setIsProfileHovered(true)}
                            onMouseLeave={() => setIsProfileHovered(false)}
                            icon={<AnimatedUser size={24} isHovered={isProfileHovered} />}
                        />

                        <MenuList
                            minW="260px"
                            p={0}
                            overflow="hidden"
                            color={isDark ? "gray.100" : "gray.800"}
                            bg={isDark ? "black" : "white"}
                            borderColor={isDark ? "gray.700" : "gray.200"}
                            boxShadow={isDark ? "0 0 15px rgba(255,255,255,0.1)" : "lg"}
                        >
                            <Box px={4} py={3}>
                                <VStack align="start" gap={1}>
                                    <Text fontWeight="bold" fontSize="md" color={isDark ? "white" : "gray.900"}>
                                        {fullUser?.name || "Usuário"}
                                    </Text>
                                    <Text fontSize="xs" color={isDark ? "gray.400" : "gray.500"} title={fullUser?.email}>
                                        {fullUser?.email || "Email não disponível"}
                                    </Text>
                                    <HStack mt={2} justify="space-between" w="full" gap={4}>
                                        <Text fontSize="xs" fontWeight="bold" color={isDark ? "gray.400" : "gray.600"}>
                                            MAT: {fullUser?.registration || "---"}
                                        </Text>
                                        <RoleBadge role={primaryRole} isDark={isDark} />
                                    </HStack>
                                </VStack>
                            </Box>

                            <MenuDivider m={0} borderColor={isDark ? "gray.600" : "gray.200"} />

                            <MenuItem
                                onClick={handleLogout}
                                px={4} py={3} fontSize="sm" fontWeight="medium" bg="transparent"
                                color={isDark ? "gray.400" : "gray.500"}
                                _hover={{
                                    bg: isDark ? "whiteAlpha.100" : "gray.100",
                                    color: "red.500",
                                    textShadow: isDark ? "0 0 12px #ef4444" : "none"
                                }}
                                onMouseEnter={() => setIsLogoutHovered(true)}
                                onMouseLeave={() => setIsLogoutHovered(false)}
                            >
                                <Box
                                    as="span" mr="8px" display="inline-flex" alignItems="center"
                                    style={{
                                        filter: (isDark && isLogoutHovered) ? "drop-shadow(0 0 6px #ef4444)" : "none",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <AnimatedArrowBigLeftDash size={20} isHovered={isLogoutHovered} />
                                </Box>
                                Sair do Ticket System
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </Flex>

            <Flex h="calc(100dvh - 70px)" overflow="hidden">
                <Box display={{ base: "none", md: "block" }}>
                    <Sidebar />
                </Box>

                <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose} size="xs">
                    <DrawerOverlay />
                    <DrawerContent bg={isDark ? "black" : "white"}>
                        <DrawerBody
                            p={0}
                            css={{
                                '&::-webkit-scrollbar': { display: 'none' },
                                'scrollbarWidth': 'none'
                            }}
                        >
                            <Flex direction="column" h="100%">
                                <Box flex="1" overflowY="auto">
                                    <SidebarMenuList expanded onNavigate={onMenuClose} />
                                </Box>

                                <Box
                                    flexShrink={0} p={3}
                                    borderTopWidth="1px"
                                    borderColor={isDark ? "whiteAlpha.200" : "gray.200"}
                                >
                                    <Text
                                        px={1} mb={2} fontSize="xs" fontWeight="bold"
                                        textTransform="uppercase" letterSpacing="wider"
                                        color={isDark ? "gray.400" : "gray.500"}
                                    >
                                        Filial
                                    </Text>
                                    <VStack align="stretch" spacing={1} mb={3}>
                                        {plants.map(p => {
                                            const isActivePlant = p.id.toString() === activePlantId;
                                            return (
                                                <HStack
                                                    key={p.id}
                                                    px={3} py={2} spacing={2.5} cursor="pointer" borderRadius="lg"
                                                    bg={isActivePlant ? (isDark ? "whiteAlpha.200" : "gray.100") : "transparent"}
                                                    color={isDark ? "whiteAlpha.900" : "gray.800"}
                                                    _hover={{ bg: isDark ? "whiteAlpha.300" : "gray.200" }}
                                                    onClick={() => { handlePlantSelect(p.id); onMenuClose(); }}
                                                >
                                                    <AnimatedMapPinHouse size={16} isHovered={false} />
                                                    <Text fontSize="sm" fontWeight={isActivePlant ? "bold" : "medium"}>{p.name}</Text>
                                                </HStack>
                                            );
                                        })}
                                    </VStack>
                                    <HStack justify="space-between" px={1}>
                                        <Text fontSize="sm" color={isDark ? "gray.300" : "gray.700"}>
                                            Som de notificação
                                        </Text>
                                        <NotificationSoundMenu isDark={isDark} />
                                    </HStack>
                                </Box>
                            </Flex>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>

                <Flex
                    direction="column" flex="1" ml={{ base: "0", md: "60px" }}
                    bg={isDark ? "black" : "gray.50"} transition="background 0.2s" overflow="hidden"
                >
                    <Box flex="1" overflowY="auto">
                        <Outlet />
                    </Box>

                    <Box
                        flexShrink={0} pb={4} pt={4} mx={{ base: 4, md: 6 }} textAlign="center" fontSize="xs"
                        color={footerColor} borderTop="1px solid" borderColor={footerBorderColor}
                    >
                        &copy; 2026 Ticket System. Todos os direitos reservados.<br />
                        Desenvolvido por Dev Santhiago. v: {__APP_VERSION__}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};