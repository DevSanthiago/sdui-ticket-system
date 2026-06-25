export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface TreemapInput<T> {
    item: T;
    value: number;
}

export interface TreemapCell<T> {
    item: T;
    rect: Rect;
}

const worstRatio = (areas: number[], side: number): number => {
    if (areas.length === 0) return Infinity;
    const sum = areas.reduce((acc, a) => acc + a, 0);
    const max = Math.max(...areas);
    const min = Math.min(...areas);
    const sum2 = sum * sum;
    const side2 = side * side;
    return Math.max((side2 * max) / sum2, sum2 / (side2 * min));
};

export const squarify = <T,>(inputs: TreemapInput<T>[], rect: Rect): TreemapCell<T>[] => {
    const valid = inputs.filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
    if (valid.length === 0 || rect.w <= 0 || rect.h <= 0) return [];

    const total = valid.reduce((acc, i) => acc + i.value, 0);
    const area = rect.w * rect.h;
    const scaled = valid.map((i) => ({ item: i.item, area: (i.value / total) * area }));

    const cells: TreemapCell<T>[] = [];
    const free: Rect = { ...rect };
    let i = 0;

    while (i < scaled.length) {
        const row: { item: T; area: number }[] = [];
        const side = Math.min(free.w, free.h);

        while (i < scaled.length) {
            const currentAreas = row.map((r) => r.area);
            const nextAreas = [...currentAreas, scaled[i].area];
            if (row.length === 0 || worstRatio(nextAreas, side) <= worstRatio(currentAreas, side)) {
                row.push(scaled[i]);
                i++;
            } else {
                break;
            }
        }

        const rowArea = row.reduce((acc, r) => acc + r.area, 0);

        if (free.w <= free.h) {
            const rowH = rowArea / free.w;
            let x = free.x;
            for (const r of row) {
                const w = r.area / rowH;
                cells.push({ item: r.item, rect: { x, y: free.y, w, h: rowH } });
                x += w;
            }
            free.y += rowH;
            free.h -= rowH;
        } else {
            const colW = rowArea / free.h;
            let y = free.y;
            for (const r of row) {
                const h = r.area / colW;
                cells.push({ item: r.item, rect: { x: free.x, y, w: colW, h } });
                y += h;
            }
            free.x += colW;
            free.w -= colW;
        }
    }

    return cells;
};
