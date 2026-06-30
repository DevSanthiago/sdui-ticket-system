import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Switch, Text, HStack, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemedSelect } from "../common/ThemedSelect";
import { useSoundAlert } from "../../hooks/notifications/useSoundAlert";
import type { KioskView } from "../../hooks/kiosk/useKioskView";
import {
    AnimatedSettings, AnimatedGalleryThumbnails, AnimatedFlame,
    AnimatedLayoutPanelTop, AnimatedVolume, AnimatedLogOut
} from "../icons/NewAnimatedIcons";

interface KioskControlMenuProps {
    isDark: boolean;
    currentView: KioskView;
    onSelectView: (view: KioskView) => void;
    onExit: () => void;
}

const VIEW_OPTIONS: { id: KioskView; label: string; icon: typeof AnimatedFlame }[] = [
    { id: "board", label: "Painel de Tickets", icon: AnimatedLayoutPanelTop },
    { id: "andon", label: "Painel de Calor Andon", icon: AnimatedGalleryThumbnails },
    { id: "heatmap", label: "Painel Heatmap das Linhas", icon: AnimatedFlame },
];

export const KioskControlMenu = ({ isDark, currentView, onSelectView, onExit }: KioskControlMenuProps) => {
    const { enabled, setEnabled, selectedSoundId, selectSound, sounds, preview } = useSoundAlert();

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const sectionLabelColor = isDark ? "gray.400" : "gray.500";
    const dividerColor = isDark ? "gray.700" : "gray.200";

    return (
        <Box position="relative" ref={menuRef}>
            <IconButton
                aria-label="Opções do painel"
                onClick={() => setIsOpen(prev => !prev)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                icon={<AnimatedSettings size={24} isHovered={isHovered || isOpen} />}
                isRound size="lg"
                bg={isDark ? "whiteAlpha.200" : "blackAlpha.100"}
                color={isDark ? "white" : "gray.800"}
                boxShadow="lg"
                _hover={{ bg: isDark ? "whiteAlpha.300" : "blackAlpha.200", transform: "scale(1.05)" }}
                transition="all 0.2s"
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "absolute",
                            right: 0,
                            bottom: "60px",
                            transformOrigin: "bottom right",
                            zIndex: 30,
                        }}
                    >
                        <Box
                            minW="280px"
                            bg={isDark ? "black" : "white"}
                            borderWidth="1px" borderColor={dividerColor}
                            borderRadius="xl"
                            boxShadow={isDark ? "0 0 20px rgba(255,255,255,0.08)" : "lg"}
                            overflow="hidden"
                        >
                            <Box px={4} pt={3} pb={2}>
                                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase"
                                    letterSpacing="wider" color={sectionLabelColor}>
                                    Visualização
                                </Text>
                            </Box>
                            <VStack align="stretch" spacing={1} px={2} pb={2}>
                                {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
                                    const active = currentView === id;
                                    return (
                                        <HStack
                                            key={id}
                                            as="button"
                                            type="button"
                                            onClick={() => { onSelectView(id); setIsOpen(false); }}
                                            spacing={3} px={3} py={2} borderRadius="lg"
                                            bg={active ? (isDark ? "whiteAlpha.200" : "blackAlpha.100") : "transparent"}
                                            color={isDark ? "whiteAlpha.900" : "gray.800"}
                                            _hover={{ bg: isDark ? "whiteAlpha.100" : "blackAlpha.50" }}
                                            transition="background 0.15s"
                                        >
                                            <Box color={active ? (isDark ? "green.300" : "green.600") : "inherit"}>
                                                <Icon size={18} isHovered={active} />
                                            </Box>
                                            <Text fontSize="sm" fontWeight={active ? "bold" : "medium"}>
                                                {label}
                                            </Text>
                                        </HStack>
                                    );
                                })}
                            </VStack>

                            <Box borderTopWidth="1px" borderColor={dividerColor} px={4} pt={3} pb={2}>
                                <HStack spacing={2} mb={3}>
                                    <Box color={sectionLabelColor}>
                                        <AnimatedVolume size={14} isHovered={enabled} />
                                    </Box>
                                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase"
                                        letterSpacing="wider" color={sectionLabelColor}>
                                        Alerta sonoro
                                    </Text>
                                </HStack>

                                <VStack align="stretch" spacing={3} pb={1}>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="medium"
                                            color={enabled ? (isDark ? "green.300" : "green.600") : (isDark ? "gray.500" : "gray.400")}>
                                            {enabled ? "Ativado" : "Desativado"}
                                        </Text>
                                        <Switch colorScheme="green" isChecked={enabled}
                                            onChange={(e) => setEnabled(e.target.checked)} />
                                    </HStack>

                                    <Box opacity={enabled ? 1 : 0.5} pointerEvents={enabled ? "auto" : "none"}>
                                        <ThemedSelect
                                            value={selectedSoundId}
                                            onChange={selectSound}
                                            options={sounds.map(sound => ({ value: sound.id, label: sound.label }))}
                                        />
                                    </Box>

                                    <Text as="button" type="button" onClick={preview}
                                        fontSize="xs" fontWeight="bold" alignSelf="flex-start"
                                        color={isDark ? "green.300" : "green.600"}
                                        _hover={{ textDecoration: "underline" }}>
                                        Testar som selecionado
                                    </Text>
                                </VStack>
                            </Box>

                            <Box borderTopWidth="1px" borderColor={dividerColor} p={2}>
                                <HStack
                                    as="button" type="button"
                                    onClick={() => { setIsOpen(false); onExit(); }}
                                    spacing={3} px={3} py={2} borderRadius="lg" w="100%"
                                    color={isDark ? "red.300" : "red.500"}
                                    _hover={{ bg: isDark ? "whiteAlpha.100" : "red.50" }}
                                    transition="background 0.15s"
                                >
                                    <AnimatedLogOut size={18} isHovered={false} />
                                    <Text fontSize="sm" fontWeight="bold">Sair do modo painel</Text>
                                </HStack>
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
