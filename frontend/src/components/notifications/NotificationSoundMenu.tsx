import { Box, IconButton, Switch, Text, HStack, VStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedVolume } from "../icons/NewAnimatedIcons";
import { ThemedSelect } from "../common/ThemedSelect";
import { useSoundAlert } from "../../hooks/notifications/useSoundAlert";

interface NotificationSoundMenuProps {
    isDark: boolean;
    placement?: "bottom" | "top";
}

export const NotificationSoundMenu = ({ isDark, placement = "bottom" }: NotificationSoundMenuProps) => {
    const {
        enabled, setEnabled,
        selectedSoundId, selectSound,
        sounds, preview,
        isOpen, toggleOpen,
        menuRef
    } = useSoundAlert();

    const openUpwards = placement === "top";

    return (
        <Box position="relative" ref={menuRef}>
            <IconButton
                aria-label="Alertas sonoros"
                variant="ghost"
                size="sm"
                color={isDark ? "whiteAlpha.900" : "gray.700"}
                filter={isDark ? "drop-shadow(0 0 7px rgba(255, 255, 255, 0.5))" : "none"}
                _hover={{
                    bg: isDark ? "whiteAlpha.200" : "gray.100",
                    filter: isDark ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.8))" : "none"
                }}
                onClick={toggleOpen}
                icon={<AnimatedVolume size={22} isHovered={enabled} />}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "absolute",
                            right: 0,
                            ...(openUpwards ? { bottom: "52px" } : { top: "44px" }),
                            transformOrigin: openUpwards ? "bottom right" : "top right",
                            zIndex: 30
                        }}
                    >
                        <Box
                            minW="260px"
                            bg={isDark ? "black" : "white"}
                            borderWidth="1px"
                            borderColor={isDark ? "gray.700" : "gray.200"}
                            borderRadius="xl"
                            boxShadow={isDark ? "0 0 20px rgba(255,255,255,0.08)" : "lg"}
                        >
                            <Box px={4} py={3} borderBottomWidth="1px" borderColor={isDark ? "gray.700" : "gray.200"}>
                                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={isDark ? "gray.400" : "gray.500"}>
                                    Alertas sonoros
                                </Text>
                            </Box>

                            <VStack align="stretch" spacing={4} px={4} py={4}>
                                <VStack align="stretch" spacing={2}>
                                    <Text fontSize="sm" fontWeight="medium" color={isDark ? "whiteAlpha.900" : "gray.800"}>
                                        Tocar som em novo ticket
                                    </Text>
                                    <HStack justify="space-between">
                                        <Text fontSize="sm" fontWeight="medium" color={enabled ? (isDark ? "green.300" : "green.600") : (isDark ? "gray.500" : "gray.400")}>
                                            {enabled ? "Ativado" : "Desativado"}
                                        </Text>
                                        <Switch
                                            colorScheme="green"
                                            isChecked={enabled}
                                            onChange={(e) => setEnabled(e.target.checked)}
                                        />
                                    </HStack>
                                </VStack>

                                <VStack align="stretch" spacing={1.5}>
                                    <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" color={isDark ? "gray.400" : "gray.500"}>
                                        Som de notificação
                                    </Text>
                                    <Box opacity={enabled ? 1 : 0.5} pointerEvents={enabled ? "auto" : "none"}>
                                        <ThemedSelect
                                            value={selectedSoundId}
                                            onChange={selectSound}
                                            options={sounds.map(sound => ({ value: sound.id, label: sound.label }))}
                                        />
                                    </Box>
                                </VStack>

                                <Text
                                    as="button"
                                    type="button"
                                    onClick={preview}
                                    fontSize="xs"
                                    fontWeight="bold"
                                    alignSelf="flex-start"
                                    color={isDark ? "green.300" : "green.600"}
                                    _hover={{ textDecoration: "underline" }}
                                >
                                    Testar som selecionado
                                </Text>
                            </VStack>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
