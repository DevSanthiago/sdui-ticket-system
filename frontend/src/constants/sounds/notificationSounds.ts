import notification99 from "../../assets/sounds/notification-99.mp3";
import notificationFahh from "../../assets/sounds/notification-fahh.mp3";
import notificationFahhSlowed from "../../assets/sounds/notification-fahh-slowed.mp3";
import notificationUber from "../../assets/sounds/notification-uber.mp3";

export interface NotificationSound {
    id: string;
    label: string;
    src: string;
}

export const NOTIFICATION_SOUNDS: NotificationSound[] = [
    { id: "99", label: "99", src: notification99 },
    { id: "fahh", label: "Fahh", src: notificationFahh },
    { id: "fahh-slowed", label: "Fahh (Slowed)", src: notificationFahhSlowed },
    { id: "uber", label: "Uber", src: notificationUber }
];

export const DEFAULT_SOUND_ID = NOTIFICATION_SOUNDS[0].id;

export const findSoundById = (id: string | null): NotificationSound =>
    NOTIFICATION_SOUNDS.find(sound => sound.id === id) ?? NOTIFICATION_SOUNDS[0];
