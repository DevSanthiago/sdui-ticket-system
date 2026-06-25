import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import { useAuth } from "../auth/useAuth";
import { useColorModeValue } from "../theme/useColorModeValue";
import { plantsService } from "../../services/api/plantsService";
import { Alert } from "../../services/alerts/alertService";
import { LAYOUT_CONSTANTS } from "../../constants/layout/layoutConstants";
import { STORAGE_KEYS } from "../../constants/storage/storageKeys";
import { getGreetingMessage, getFirstName } from "../../helpers/layoutHelper";
import type { Plant, UserRole } from "../../types/models.types";

export const useLayout = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const navigate = useNavigate();
    
    const { user: fullUser } = useAuth();
    const userName = getFirstName(fullUser?.name);
    const isMaster = fullUser?.roles?.some((r: UserRole) => r.name.toLowerCase() === 'admin');
    const primaryRole = fullUser?.roles?.[0];

    const footerColor = useColorModeValue("gray.500", "gray.400");
    const footerBorderColor = useColorModeValue("gray.200", "gray.700");

    const [isThemeHovered, setIsThemeHovered] = useState(false);
    const [isProfileHovered, setIsProfileHovered] = useState(false);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);
    const [isPlantHovered, setIsPlantHovered] = useState(false);
    const [isExitKioskHovered, setIsExitKioskHovered] = useState(false);

    const [isPlantMenuOpen, setIsPlantMenuOpen] = useState(false);
    const plantMenuRef = useRef<HTMLDivElement>(null);

    const togglePlantMenu = () => setIsPlantMenuOpen(prev => !prev);

    useEffect(() => {
        if (!isPlantMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (plantMenuRef.current && !plantMenuRef.current.contains(event.target as Node)) {
                setIsPlantMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isPlantMenuOpen]);

    const [greeting] = useState(getGreetingMessage);
    const [plants, setPlants] = useState<Plant[]>([]);
    const [activePlantId, setActivePlantId] = useState(() => 
        localStorage.getItem(LAYOUT_CONSTANTS.STORAGE_KEYS.ACTIVE_PLANT) || ""
    );

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const res = await plantsService.getAllPlants();
                setPlants(res.data);

                if (!activePlantId && res.data.length > 0) {
                    const defaultPlant = res.data[0].id.toString();
                    setActivePlantId(defaultPlant);
                    localStorage.setItem(LAYOUT_CONSTANTS.STORAGE_KEYS.ACTIVE_PLANT, defaultPlant);
                }
            } catch (error) {
                console.error("Erro ao buscar as fábricas disponíveis", error);
            }
        };
        fetchPlants();
    }, [activePlantId]);

    const activePlantName = plants.find(p => p.id.toString() === activePlantId)?.name || "Carregando...";

    const handlePlantChange = (plantId: number) => {
        localStorage.setItem(LAYOUT_CONSTANTS.STORAGE_KEYS.ACTIVE_PLANT, plantId.toString());
        window.location.reload();
    };

    const handlePlantSelect = (plantId: number) => {
        if (isMaster) {
            handlePlantChange(plantId);
            return;
        }

        setIsPlantMenuOpen(false);

        if (plantId.toString() !== activePlantId) {
            Alert.warning(
                "Acesso restrito",
                "Somente administradores podem alternar entre filiais dentro do Ticket System.",
                isDark
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        navigate("/login");
    };

    const handleExitKiosk = () => {
        localStorage.removeItem(STORAGE_KEYS.KIOSK);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        navigate("/login");
    };

    return {
        isDark,
        fullUser,
        userName,
        greeting,
        isMaster,
        primaryRole,
        plants,
        activePlantId,
        activePlantName,
        footerColor,
        footerBorderColor,
        isThemeHovered, setIsThemeHovered,
        isProfileHovered, setIsProfileHovered,
        isLogoutHovered, setIsLogoutHovered,
        isPlantHovered, setIsPlantHovered,
        isExitKioskHovered, setIsExitKioskHovered,
        isPlantMenuOpen, togglePlantMenu, plantMenuRef,
        toggleColorMode,
        handlePlantChange,
        handlePlantSelect,
        handleLogout,
        handleExitKiosk
    };
};