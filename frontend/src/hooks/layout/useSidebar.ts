import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { SIDEBAR_MENU_ITEMS, type SidebarMenuItem } from "../../constants/layout/sidebarMenu";
import { useColorModeValue } from "../theme/useColorModeValue";
import { useMinimalTheme } from "../theme/useMinimalTheme";
import { usePendingChecklist } from "../checklist/usePendingChecklist";

export const useSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useMinimalTheme();
    const { hasPending: hasPendingChecklist } = usePendingChecklist();

    const sidebarBg = useColorModeValue("white", "black");
    const borderRight = useColorModeValue("1px solid", "1px solid rgba(255,255,255,0.05)");

    const isMaster = useMemo(() => {
        return user?.roles?.some(r => r.name.toLowerCase() === "admin") ?? false;
    }, [user]);

    const visibleMenuItems = useMemo(() => {
        return SIDEBAR_MENU_ITEMS.filter(item => {
            if (item.requiresMaster && !isMaster) return false;
            return true;
        });
    }, [isMaster]);

    const checkIsActive = (item: SidebarMenuItem, currentPath: string) => {

        return item.activePaths.some(path => 
            path === "/" ? currentPath === "/" : currentPath.startsWith(path)
        );
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return {
        isExpanded,
        setIsExpanded,
        visibleMenuItems,
        sidebarBg,
        borderRight,
        theme,
        currentPath: location.pathname,
        checkIsActive,
        handleNavigation,
        hasPendingChecklist
    };
};