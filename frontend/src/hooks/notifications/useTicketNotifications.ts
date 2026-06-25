import { useEffect } from "react";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { baseURL } from "../../services/api/api";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";
import { soundAlertService } from "../../services/notifications/soundAlertService";
import { isSoundAlertEnabled, getSoundAlertId } from "./useSoundAlert";

export const TICKET_CREATED_EVENT = "ticketsystem:ticket-created";

const hubUrl = `${baseURL.replace(/\/api\/?$/, "")}/hubs/tickets`;

export const useTicketNotifications = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        const plantId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANT) ?? "";

        const connection = new HubConnectionBuilder()
            .withUrl(`${hubUrl}?plantId=${encodeURIComponent(plantId)}`, {
                accessTokenFactory: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? "",
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connection.on("TicketCreated", () => {
            if (isSoundAlertEnabled()) {
                soundAlertService.playById(getSoundAlertId());
            }
            window.dispatchEvent(new Event(TICKET_CREATED_EVENT));
        });

        let cancelled = false;

        connection.start()
            .then(() => {
                if (cancelled) connection.stop().catch(() => { });
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error("Falha ao conectar ao hub de tickets", error);
                }
            });

        return () => {
            cancelled = true;
            connection.off("TicketCreated");
            if (connection.state === HubConnectionState.Connected) {
                connection.stop().catch(() => { });
            }
        };
    }, [enabled]);
};
