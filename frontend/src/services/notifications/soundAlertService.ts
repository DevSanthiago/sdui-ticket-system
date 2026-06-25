import { findSoundById } from "../../constants/sounds/notificationSounds";

let currentAudio: HTMLAudioElement | null = null;

const play = (src: string) => {
    try {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const audio = new Audio(src);
        currentAudio = audio;
        void audio.play().catch(() => { });
    } catch {
        currentAudio = null;
    }
};

export const soundAlertService = {
    play,
    playById: (id: string | null) => play(findSoundById(id).src)
};
