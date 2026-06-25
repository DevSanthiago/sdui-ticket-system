import { useMemo, useEffect } from 'react';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { Alert } from '../../services/alerts/alertService';
import type { AnimatedIconKey, CardData } from '../../types';

interface UseCardBuilderParams {
    data: CardData;
    isDarkMode: boolean;
    onChange: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
}

export const useCardBuilder = ({ data, isDarkMode, onChange }: UseCardBuilderParams) => {
    const badges = useMemo(() => {
        return (data.badgeInput || '')
            .split(',')
            .map(b => b.trim())
            .filter(b => b.length > 0);
    }, [data.badgeInput]);

    useEffect(() => {
        if (badges.length > 3) {
            Alert.toast("Limite de 3 badges atingido", "warning", isDarkMode);
            onChange('badgeInput', badges.slice(0, 3).join(', ') + ',');
        }
    }, [badges, isDarkMode, onChange]);

    const selectedIcon = useMemo(() => {
        const IconComponent = AnimatedIcons[data.iconName as AnimatedIconKey] ?? AnimatedIcons.AnimatedBox;
        return IconComponent;
    }, [data.iconName]);

    return { badges, selectedIcon };
};