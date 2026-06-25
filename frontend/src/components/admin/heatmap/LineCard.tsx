import type { CSSProperties } from "react";
import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import type { ConnectorBoardCard } from "../../../types";

const neon = keyframes`
    0%, 100% { box-shadow: 0 0 6px 0 var(--glow), 0 0 0 0 var(--glow); }
    50% { box-shadow: 0 0 22px 4px var(--glow), 0 0 38px 12px var(--glow); }
`;

const levelColor = (count: number) =>
    count <= 0 ? "#22c55e"
        : count === 1 ? "#eab308"
            : count <= 3 ? "#f97316"
                : "#ff0000";

interface LineCardProps {
    card: ConnectorBoardCard;
}

export const LineCard = ({ card }: LineCardProps) => {
    const theme = useMinimalTheme();
    const color = levelColor(card.openCount);
    const isActive = card.openCount > 0;

    return (
        <Box
            p={5}
            w="200px"
            h="160px"
            flex="0 0 auto"
            borderRadius="xl"
            borderWidth="2px"
            borderColor={color}
            bg={`${color}1a`}
            color={theme.textPrimary}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            overflow="hidden"
            style={{ "--glow": color } as CSSProperties}
            animation={isActive ? `${neon} 1.6s ease-in-out infinite` : undefined}
            transition="border-color 0.5s ease, background 0.5s ease"
        >
            <Box>
                <Text fontSize="xs" fontWeight="bold" opacity={0.65} textTransform="uppercase"
                    letterSpacing="wider" noOfLines={1}>
                    {card.prefixLabel}
                </Text>
                <Text fontSize="xl" fontWeight="extrabold" noOfLines={1}>
                    {card.lineName}
                </Text>
            </Box>
            <Box display="flex" alignItems="baseline" gap={2}>
                <Text
                    fontSize="4xl" fontWeight="black" lineHeight="1" color={color}
                    style={{ textShadow: isActive ? `0 0 14px ${color}` : undefined }}>
                    {card.openCount}
                </Text>
                <Text fontSize="xs" opacity={0.65}>
                    {card.openCount === 1 ? "ticket aberto" : "tickets abertos"}
                </Text>
            </Box>
        </Box>
    );
};
