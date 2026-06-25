import { memo } from "react";
import { Box, Text } from "@chakra-ui/react";
import type { Rect } from "../../../helpers/treemap";
import { downtimeMinutes, heatColor } from "../../../helpers/heatmapColor";
import type { HeatmapTile as HeatmapTileData } from "../../../types";

interface HeatmapTileProps {
    item: HeatmapTileData;
    rect: Rect;
    now: number;
}

const formatDowntime = (minutes: number): string => {
    const total = Math.floor(minutes);
    if (total < 60) return `${total}min`;
    const hours = Math.floor(total / 60);
    const rest = total % 60;
    return `${hours}h${rest.toString().padStart(2, "0")}`;
};

const HeatmapTileComponent = ({ item, rect, now }: HeatmapTileProps) => {
    const minutes = downtimeMinutes(item.oldestOpenStoppedAt, now);
    const color = heatColor(minutes);
    const tiny = rect.w < 54 || rect.h < 40;
    const compact = rect.w < 96 || rect.h < 70;
    const nameSize = Math.max(9, Math.min(20, Math.round(Math.min(rect.w, rect.h) / 5.5)));

    return (
        <Box
            position="absolute"
            left={`${rect.x}px`}
            top={`${rect.y}px`}
            width={`${rect.w}px`}
            height={`${rect.h}px`}
            p={tiny ? 1 : 2}
            bg={color}
            color="#ffffff"
            borderWidth="1px"
            borderColor="rgba(0,0,0,0.35)"
            borderRadius="sm"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            transition="background 0.6s ease"
        >
            <Text
                fontWeight="bold"
                lineHeight="1.1"
                noOfLines={tiny ? 1 : 2}
                fontSize={`${nameSize}px`}
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
            >
                {item.lineName}
            </Text>
            {!tiny && (
                <Box style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}>
                    <Text fontSize={compact ? "xs" : "sm"} fontWeight="semibold">
                        {item.openCount} {item.openCount === 1 ? "ticket" : "tickets"}
                    </Text>
                    {item.oldestOpenStoppedAt && (
                        <Text fontSize={compact ? "2xs" : "xs"} opacity={0.95}>
                            parada {formatDowntime(minutes)}
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    );
};

export const HeatmapTile = memo(HeatmapTileComponent);
