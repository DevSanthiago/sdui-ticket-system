import {
    AnimatedLayoutPanelTop,
    AnimatedPanelLeftClose,
    AnimatedGalleryVerticalEnd,
    AnimatedDatabaseBackup,
    AnimatedClock,
    AnimatedCloudSync,
    AnimatedMailbox
} from "../../components/icons/NewAnimatedIcons";
import type { ElementType } from "react";

export interface SidebarMenuItem {
    id: string;
    label: string;
    path: string;
    icon: ElementType;
    requiresMaster?: boolean;
    activePaths: string[];
}

export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
    {
        id: "cockpit-admin",
        label: "Cockpit ADM",
        path: "/cockpit-admin",
        icon: AnimatedLayoutPanelTop,
        requiresMaster: true,
        activePaths: ["/cockpit-admin"]
    },
    {
        id: "actions-panel",
        label: "Painel de Ações",
        path: "/",
        icon: AnimatedPanelLeftClose,
        activePaths: ["/", "/actions"]
    },
    {
        id: "tickets-board",
        label: "Painel de Tickets",
        path: "/tickets/board",
        icon: AnimatedGalleryVerticalEnd,
        activePaths: ["/tickets"]
    },
    {
        id: "tickets-history",
        label: "Histórico de Tickets",
        path: "/ticket-history",
        icon: AnimatedDatabaseBackup,
        activePaths: ["/ticket-history"]
    },
    {
        id: "inbox",
        label: "Caixa de Entrada",
        path: "/checklists",
        icon: AnimatedMailbox,
        activePaths: ["/checklists"]
    },
    {
        id: "downtime-live",
        label: "Downtime LIVE",
        path: "/analytics/downtime-geral",
        icon: AnimatedClock,
        activePaths: ["/analytics/downtime-geral"]
    },
    {
        id: "downtime-history",
        label: "Downtime Histórico",
        path: "/analytics/downtime-historico",
        icon: AnimatedCloudSync,
        activePaths: ["/analytics/downtime-historico"]
    }
];