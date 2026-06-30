import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";

export type KioskView = "board" | "andon" | "heatmap";

const KIOSK_VIEW_CHANGED_EVENT = "ticketsystem:kiosk-view-changed";
const DEFAULT_VIEW: KioskView = "board";

const isKioskView = (value: string | null): value is KioskView =>
    value === "board" || value === "andon" || value === "heatmap";

export const getKioskView = (): KioskView => {
    const stored = localStorage.getItem(STORAGE_KEYS.KIOSK_VIEW);
    return isKioskView(stored) ? stored : DEFAULT_VIEW;
};

export const useKioskView = () => {
    const [view, setViewState] = useState<KioskView>(getKioskView);

    useEffect(() => {
        const sync = () => setViewState(getKioskView());
        window.addEventListener(KIOSK_VIEW_CHANGED_EVENT, sync);
        return () => window.removeEventListener(KIOSK_VIEW_CHANGED_EVENT, sync);
    }, []);

    const setView = useCallback((next: KioskView) => {
        localStorage.setItem(STORAGE_KEYS.KIOSK_VIEW, next);
        setViewState(next);
        window.dispatchEvent(new Event(KIOSK_VIEW_CHANGED_EVENT));
    }, []);

    return { view, setView };
};
