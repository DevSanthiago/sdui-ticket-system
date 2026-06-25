import { useState, useEffect, useRef, useCallback } from "react";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";
import { NOTIFICATION_SOUNDS, DEFAULT_SOUND_ID, findSoundById } from "../../constants/sounds/notificationSounds";
import { soundAlertService } from "../../services/notifications/soundAlertService";

const PREFS_CHANGED_EVENT = "ticketsystem:sound-alert-prefs-changed";

export const isSoundAlertEnabled = () =>
    localStorage.getItem(STORAGE_KEYS.SOUND_ALERT_ENABLED) === "true";

export const getSoundAlertId = () =>
    localStorage.getItem(STORAGE_KEYS.SOUND_ALERT_ID) ?? DEFAULT_SOUND_ID;

export const useSoundAlert = () => {
    const [enabled, setEnabledState] = useState(isSoundAlertEnabled);
    const [selectedSoundId, setSelectedSoundIdState] = useState(getSoundAlertId);

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => setIsOpen(prev => !prev);

    const syncFromStorage = useCallback(() => {
        setEnabledState(isSoundAlertEnabled());
        setSelectedSoundIdState(getSoundAlertId());
    }, []);

    useEffect(() => {
        window.addEventListener(PREFS_CHANGED_EVENT, syncFromStorage);
        return () => window.removeEventListener(PREFS_CHANGED_EVENT, syncFromStorage);
    }, [syncFromStorage]);

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

    const setEnabled = useCallback((value: boolean) => {
        localStorage.setItem(STORAGE_KEYS.SOUND_ALERT_ENABLED, String(value));
        setEnabledState(value);
        window.dispatchEvent(new Event(PREFS_CHANGED_EVENT));
        if (value) soundAlertService.playById(getSoundAlertId());
    }, []);

    const selectSound = useCallback((id: string) => {
        localStorage.setItem(STORAGE_KEYS.SOUND_ALERT_ID, id);
        setSelectedSoundIdState(id);
        window.dispatchEvent(new Event(PREFS_CHANGED_EVENT));
        soundAlertService.playById(id);
    }, []);

    const preview = useCallback(() => {
        soundAlertService.play(findSoundById(selectedSoundId).src);
    }, [selectedSoundId]);

    return {
        enabled, setEnabled,
        selectedSoundId, selectSound,
        sounds: NOTIFICATION_SOUNDS,
        preview,
        isOpen, toggleOpen,
        isHovered, setIsHovered,
        menuRef
    };
};
