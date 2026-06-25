import { useColorModeValue } from "./useColorModeValue";

export const useMinimalTheme = () => {
    const isDark = useColorModeValue(false, true);

    return {
        bgApp: isDark ? "black" : "gray.50",
        
        cardBg: isDark ? "#0A0A0A" : "white",
        cardBorder: isDark ? "whiteAlpha.200" : "gray.200",
        cardBorderHover: isDark ? "whiteAlpha.400" : "gray.300",
        
        textPrimary: isDark ? "whiteAlpha.900" : "gray.800",
        textSecondary: isDark ? "gray.400" : "gray.500",
        
        iconColor: isDark ? "gray.300" : "gray.600",
        
        badgeBg: isDark ? "whiteAlpha.100" : "gray.50",
        badgeBorder: isDark ? "whiteAlpha.300" : "gray.200",
        
        buttonBg: isDark ? "whiteAlpha.200" : "gray.100",
        buttonHoverBg: isDark ? "whiteAlpha.300" : "gray.200",

        inputFocusBorder: isDark ? "white" : "gray.800",

        toggleActiveColor: isDark ? "black" : "white",
        toggleActiveShadow: isDark
            ? "0 0 0 1px rgba(255,255,255,0.85), 0 0 12px 2px rgba(255,255,255,0.55), 0 0 22px 4px rgba(255,255,255,0.30)"
            : "none",
    };
};