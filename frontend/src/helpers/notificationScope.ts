import { STORAGE_KEYS } from "../constants/storage/storageKeys";
import type { User } from "../types/models.types";

const ALWAYS_HEAR_ROLES = ["admin", "kioskdisplay"];

export const normalizeRole = (role: string): string =>
    (role ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase();

export const getUserRoleNames = (): string[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) return [];
    try {
        const user = JSON.parse(stored) as User;
        return (user.roles ?? [])
            .map(role => role?.name)
            .filter((name): name is string => !!name);
    } catch {
        return [];
    }
};

export const userHearsAllDepartments = (roleNames: string[]): boolean =>
    roleNames.some(role => ALWAYS_HEAR_ROLES.includes(normalizeRole(role)));

export const parseDepartmentIds = (csv: string | null | undefined): number[] => {
    if (!csv) return [];
    return csv
        .split(",")
        .map(part => Number(part.trim()))
        .filter(id => Number.isInteger(id) && id > 0);
};

export const isKioskSession = (): boolean =>
    localStorage.getItem(STORAGE_KEYS.KIOSK) === "true";

export const getKioskDepartmentIds = (): number[] =>
    parseDepartmentIds(localStorage.getItem(STORAGE_KEYS.KIOSK_DEPARTMENTS));

export const computeAttendedDepartmentIds = (
    departments: { id: number; allowedRoles: string[] }[],
    roleNames: string[]
): Set<number> => {
    const normalizedUserRoles = new Set(roleNames.map(normalizeRole));
    const attended = new Set<number>();

    for (const department of departments) {
        const matches = (department.allowedRoles ?? [])
            .some(role => normalizedUserRoles.has(normalizeRole(role)));
        if (matches) attended.add(department.id);
    }

    return attended;
};
