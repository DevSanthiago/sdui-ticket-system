import { useEffect, useRef } from "react";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { api, baseURL } from "../../services/api/api";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";
import { soundAlertService } from "../../services/notifications/soundAlertService";
import { isSoundAlertEnabled, getSoundAlertId } from "./useSoundAlert";
import {
    getUserRoleNames,
    userHearsAllDepartments,
    computeAttendedDepartmentIds,
    isKioskSession,
    getKioskDepartmentIds,
} from "../../helpers/notificationScope";

interface TicketCreatedPayload {
    ticketId: number;
    departmentId: number;
}

export const TICKET_CREATED_EVENT = "ticketsystem:ticket-created";

const hubUrl = `${baseURL.replace(/\/api\/?$/, "")}/hubs/tickets`;

export const useTicketNotifications = (enabled = true) => {
    const hearsAllRef = useRef(false);
    const attendedDeptIdsRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        if (!enabled) return;
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (!token) return;

        const plantId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLANT) ?? "";

        const roleNames = getUserRoleNames();
        const kioskDepartmentIds = isKioskSession() ? getKioskDepartmentIds() : [];

        if (kioskDepartmentIds.length > 0) {
            hearsAllRef.current = false;
            attendedDeptIdsRef.current = new Set(kioskDepartmentIds);
        } else {
            hearsAllRef.current = userHearsAllDepartments(roleNames);
            attendedDeptIdsRef.current = new Set();

            if (!hearsAllRef.current) {
                api.get<{ id: number; allowedRoles: string[] }[]>(
                    `${API_ENDPOINTS.ACTIONS_PANEL.GET_ALL}?includeInactive=true`
                )
                    .then(({ data }) => {
                        attendedDeptIdsRef.current = computeAttendedDepartmentIds(data ?? [], roleNames);
                    })
                    .catch((error) => {
                        console.error("Falha ao resolver departamentos atendidos para o som de notificação", error);
                    });
            }
        }

        const connection = new HubConnectionBuilder()
            .withUrl(`${hubUrl}?plantId=${encodeURIComponent(plantId)}`, {
                accessTokenFactory: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ?? "",
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connection.on("TicketCreated", (payload?: TicketCreatedPayload) => {
            const isForMyDepartment = hearsAllRef.current
                || (payload?.departmentId != null && attendedDeptIdsRef.current.has(payload.departmentId));

            if (isForMyDepartment && isSoundAlertEnabled()) {
                soundAlertService.playById(getSoundAlertId());
            }
            window.dispatchEvent(new Event(TICKET_CREATED_EVENT));
        });

        connection.on("TicketChanged", () => {
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
            connection.off("TicketChanged");
            if (connection.state === HubConnectionState.Connected) {
                connection.stop().catch(() => { });
            }
        };
    }, [enabled]);
};
