export const HEAT_KNEE_MINUTES = 8;
export const HEAT_MAX_MINUTES = 16;

const STOPS: { min: number; rgb: [number, number, number] }[] = [
    { min: 0, rgb: [34, 197, 94] },
    { min: 4, rgb: [234, 179, 8] },
    { min: HEAT_KNEE_MINUTES, rgb: [242, 54, 69] },
    { min: HEAT_MAX_MINUTES, rgb: [127, 29, 29] },
];

export const downtimeMinutes = (oldestOpenStoppedAt: string | null, nowMs: number): number => {
    if (!oldestOpenStoppedAt) return 0;
    const startMs = new Date(oldestOpenStoppedAt).getTime();
    if (Number.isNaN(startMs)) return 0;
    return Math.max(0, (nowMs - startMs) / 60000);
};

const toHex = (value: number): string => Math.round(value).toString(16).padStart(2, "0");

export const heatColor = (minutes: number): string => {
    const last = STOPS[STOPS.length - 1];
    const clamped = Math.min(Math.max(minutes, 0), last.min);

    let lower = STOPS[0];
    let upper = last;
    for (let i = 0; i < STOPS.length - 1; i++) {
        if (clamped >= STOPS[i].min && clamped <= STOPS[i + 1].min) {
            lower = STOPS[i];
            upper = STOPS[i + 1];
            break;
        }
    }

    const span = upper.min - lower.min || 1;
    const t = (clamped - lower.min) / span;
    const rgb = lower.rgb.map((c, i) => c + (upper.rgb[i] - c) * t);
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
};
