import { useMemo } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useElementSize } from "../../../hooks/common/useElementSize";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import { squarify } from "../../../helpers/treemap";
import type { Rect } from "../../../helpers/treemap";
import { HeatmapTile } from "./HeatmapTile";
import type { HeatmapTile as HeatmapTileData } from "../../../types";

const GROUP_HEADER = 26;
const GROUP_GAP = 6;
const ZERO_WEIGHT = 0.4;

const tileWeight = (openCount: number) => (openCount > 0 ? openCount : ZERO_WEIGHT);

interface HeatmapTreemapProps {
    tiles: HeatmapTileData[];
    now: number;
}

interface GroupData {
    prefix: string;
    prefixLabel: string;
    total: number;
    lines: HeatmapTileData[];
}

export const HeatmapTreemap = ({ tiles, now }: HeatmapTreemapProps) => {
    const theme = useMinimalTheme();
    const { ref, size } = useElementSize<HTMLDivElement>();

    const groups = useMemo<GroupData[]>(() => {
        const map = new Map<string, GroupData>();
        for (const tile of tiles) {
            const group = map.get(tile.prefix) ?? {
                prefix: tile.prefix,
                prefixLabel: tile.prefixLabel,
                total: 0,
                lines: [],
            };
            group.total += tileWeight(tile.openCount);
            group.lines.push(tile);
            map.set(tile.prefix, group);
        }
        return [...map.values()];
    }, [tiles]);

    const layout = useMemo(() => {
        if (size.width < 2 || size.height < 2 || groups.length === 0) return [];

        const groupCells = squarify(
            groups.map((group) => ({ item: group, value: group.total })),
            { x: 0, y: 0, w: size.width, h: size.height }
        );

        return groupCells.map((cell) => {
            const inner: Rect = {
                x: cell.rect.x + GROUP_GAP,
                y: cell.rect.y + GROUP_HEADER,
                w: Math.max(0, cell.rect.w - GROUP_GAP * 2),
                h: Math.max(0, cell.rect.h - GROUP_HEADER - GROUP_GAP),
            };
            const tileCells = squarify(
                cell.item.lines.map((line) => ({ item: line, value: tileWeight(line.openCount) })),
                inner
            );
            return { group: cell.item, rect: cell.rect, tileCells };
        });
    }, [groups, size]);

    return (
        <Box ref={ref} position="relative" w="100%" h="100%">
            {layout.map(({ group, rect }) => (
                <Box
                    key={`group-${group.prefix}`}
                    position="absolute"
                    left={`${rect.x}px`}
                    top={`${rect.y}px`}
                    width={`${rect.w}px`}
                    height={`${rect.h}px`}
                    borderWidth="1px"
                    borderColor={theme.cardBorder}
                    borderRadius="md"
                    pointerEvents="none"
                />
            ))}
            {layout.map(({ group, rect }) => (
                <Text
                    key={`label-${group.prefix}`}
                    position="absolute"
                    top={`${rect.y + 4}px`}
                    left={`${rect.x + GROUP_GAP}px`}
                    maxW={`${Math.max(0, rect.w - GROUP_GAP * 2)}px`}
                    fontSize="sm"
                    fontWeight="bold"
                    color={theme.textSecondary}
                    textTransform="uppercase"
                    letterSpacing="wide"
                    noOfLines={1}
                    pointerEvents="none"
                >
                    {group.prefixLabel}
                </Text>
            ))}
            {layout
                .flatMap(({ tileCells }) => tileCells)
                .map((cell) => (
                    <HeatmapTile key={cell.item.lineId} item={cell.item} rect={cell.rect} now={now} />
                ))}
        </Box>
    );
};
