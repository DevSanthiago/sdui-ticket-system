import { chakra } from "@chakra-ui/react";
import type { ChangeEvent, ReactNode } from "react";
import { useMinimalTheme } from "../../../hooks/theme/useMinimalTheme";
import { useColorModeValue } from "../../../hooks/theme/useColorModeValue";

const NativeSelect = chakra("select");

interface ThemedSelectProps {
    value: string | number;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    isDisabled?: boolean;
    children: ReactNode;
}

export const ThemedSelect = ({ value, onChange, isDisabled, children }: ThemedSelectProps) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);
    const bg = isDarkMode ? "#000000" : "#ffffff";
    const color = isDarkMode ? "#ffffff" : "#000000";

    return (
        <NativeSelect
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            w="100%" h="40px" px={3} borderRadius="md"
            borderWidth="1px" borderColor={theme.cardBorder}
            bg={bg} color={color}
            opacity={isDisabled ? 0.5 : 1}
            cursor={isDisabled ? "not-allowed" : "pointer"}
            _focusVisible={{ outline: "none", borderColor: color }}
            sx={{ "& option": { backgroundColor: bg, color } }}
        >
            {children}
        </NativeSelect>
    );
};
