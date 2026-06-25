import { useState, useEffect, useCallback, type RefObject } from 'react';

export const useFullscreen = (ref: RefObject<HTMLElement | null>) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await ref.current?.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                }
            }
        } catch (err) {
            console.error("Erro ao tentar alterar o modo tela cheia:", err);
        }
    }, [ref]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return { isFullscreen, toggleFullscreen };
};