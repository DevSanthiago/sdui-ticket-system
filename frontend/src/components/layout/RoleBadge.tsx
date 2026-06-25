import { Badge } from "@chakra-ui/react";
import { LAYOUT_CONSTANTS } from "../../constants/layout/layoutConstants";
import type { UserRole } from "../../types";

interface RoleBadgeProps {
    role?: UserRole;
    isDark: boolean;
}

export const RoleBadge = ({ role, isDark }: RoleBadgeProps) => {
    if (!role) {
        return <Badge colorScheme="gray">---</Badge>;
    }

    const roleName = role.name || "";
    const roleNameLower = roleName.toLowerCase();
    const label = roleName.replace(/-/g, ' ').toUpperCase();

    const match = Object.keys(LAYOUT_CONSTANTS.ROLE_STYLES).find(key =>
        roleNameLower.includes(key.toLowerCase())
    ) as keyof typeof LAYOUT_CONSTANTS.ROLE_STYLES | undefined;

    const style = match
        ? LAYOUT_CONSTANTS.ROLE_STYLES[match]
        : LAYOUT_CONSTANTS.ROLE_STYLES.DEFAULT;

    return (
        <Badge
            colorScheme={style.colorScheme}
            variant="outline"
            px={2} py={0.5} borderRadius="md" fontSize="xs" fontWeight="bold"
            title={role.description}
            bg="transparent" borderWidth="1px"
            borderColor={isDark ? style.neonColor : `${style.colorScheme}.500`}
            boxShadow={isDark ? `0 0 8px ${style.neonColor}, inset 0 0 2px ${style.neonColor}` : "none"}
            textShadow={isDark ? `0 0 6px ${style.neonColor}` : "none"}
            transition="all 0.3s"
        >
            {label}
        </Badge>
    );
};