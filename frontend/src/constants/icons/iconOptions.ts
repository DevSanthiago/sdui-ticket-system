import React from 'react';
import * as AnimatedIcons from '../../components/icons/NewAnimatedIcons';
import { getIconDisplayName } from '../../helpers/stringHelpers';
import type { AnimatedIconProps, IconOption } from '../../types';

const AnimatedIconsRecord = AnimatedIcons as Record<string, React.ComponentType<AnimatedIconProps>>;

export const iconOptions: IconOption[] = Object.keys(AnimatedIcons)
    .filter(key => {
        const icon = (AnimatedIcons as Record<string, unknown>)[key];
        return typeof icon === 'function' && key.startsWith('Animated');
    })
    .map(key => ({
        value: key,
        label: getIconDisplayName(key),
        component: AnimatedIconsRecord[key]
    }));