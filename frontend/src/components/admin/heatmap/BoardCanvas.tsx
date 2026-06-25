import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import { LineCard } from "./LineCard";
import type { ConnectorBoardCard } from "../../../types";

interface BoardCanvasProps {
    cards: ConnectorBoardCard[];
}

export const BoardCanvas = ({ cards }: BoardCanvasProps) => {
    const theme = useMinimalTheme();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handler = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    const toggleFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        } else {
            wrapperRef.current?.requestFullscreen().catch(() => { });
        }
    }, []);

    return (
        <Box
            ref={wrapperRef}
            position="relative"
            w="100%"
            minH={isFullscreen ? "100vh" : "60vh"}
            bg={theme.bgApp}
            borderWidth="1px"
            borderColor={theme.cardBorder}
            borderRadius="lg"
            p={6}
            overflow="auto"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(127,127,127,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(127,127,127,0.12) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
            }}
        >
            <IconButton
                aria-label={isFullscreen ? "Sair da tela cheia" : "Expandir para tela cheia"}
                icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
                onClick={toggleFullscreen}
                size="sm"
                position="absolute"
                top={3}
                right={3}
                zIndex={20}
                bg={theme.cardBg}
                color={theme.textPrimary}
                borderWidth="1px"
                borderColor={theme.cardBorder}
                _hover={{ bg: theme.buttonHoverBg }}
            />

            {cards.length === 0 ? (
                <Flex justify="center" align="center" h="50vh">
                    <Text color={theme.textSecondary} fontSize="sm" textAlign="center" maxW="420px">
                        Nenhuma linha conectada. Adicione um conector na aba “Conectores” para que as
                        linhas de produção apareçam aqui automaticamente.
                    </Text>
                </Flex>
            ) : (
                <Flex wrap="wrap" gap={4} align="flex-start" justify="center">
                    {cards.map((card) => (
                        <LineCard key={card.lineId} card={card} />
                    ))}
                </Flex>
            )}
        </Box>
    );
};
