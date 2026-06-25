import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../services/api/api";
import { plantConnectorsService } from "../../services/api/plantConnectorsService";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import { Alert } from "../../services/alerts/alertService";
import { TICKET_CREATED_EVENT } from "../notifications/useTicketNotifications";
import { ConnectorSource } from "../../types";
import type { PlantConnector, ConnectorBoardCard } from "../../types";
import type { ProductionLinesByPrefix } from "../../types/api.types";

export type HeatmapMode = "connectors" | "heatmap";

export interface PrefixOption {
    value: string;
    label: string;
}

export const useHeatmapBoard = (isDarkMode: boolean) => {
    const isDarkRef = useRef(isDarkMode);
    useEffect(() => { isDarkRef.current = isDarkMode; }, [isDarkMode]);

    const [mode, setMode] = useState<HeatmapMode>("heatmap");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [connectors, setConnectors] = useState<PlantConnector[]>([]);
    const [cards, setCards] = useState<ConnectorBoardCard[]>([]);
    const [prefixes, setPrefixes] = useState<PrefixOption[]>([]);

    const fetchBoard = useCallback(async () => {
        try {
            const { data } = await plantConnectorsService.getBoard();
            setCards(data);
        } catch {
            setCards([]);
        }
    }, []);

    const fetchConnectors = useCallback(async () => {
        const { data } = await plantConnectorsService.getAll();
        setConnectors(data);
    }, []);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [, , prefixRes] = await Promise.all([
                fetchConnectors(),
                fetchBoard(),
                api.get<ProductionLinesByPrefix[]>(API_ENDPOINTS.ADMIN_COCKPIT.PRODUCTION_LINES_BY_PREFIX),
            ]);
            setPrefixes(prefixRes.data.map((g) => ({ value: g.prefix, label: g.prefixLabel })));
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao carregar o painel.", "error", isDarkRef.current);
        } finally {
            setLoading(false);
        }
    }, [fetchConnectors, fetchBoard]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    useEffect(() => {
        const handler = () => fetchBoard();
        window.addEventListener(TICKET_CREATED_EVENT, handler);
        return () => window.removeEventListener(TICKET_CREATED_EVENT, handler);
    }, [fetchBoard]);

    const addConnector = useCallback(async (prefix: string | null) => {
        setIsSubmitting(true);
        try {
            await plantConnectorsService.create({ source: ConnectorSource.ProductionLines, prefix });
            await Promise.all([fetchConnectors(), fetchBoard()]);
            Alert.toast("Conector adicionado!", "success", isDarkRef.current);
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao adicionar o conector.", "error", isDarkRef.current);
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchConnectors, fetchBoard]);

    const removeConnector = useCallback(async (id: number) => {
        setIsSubmitting(true);
        try {
            await plantConnectorsService.remove(id);
            await Promise.all([fetchConnectors(), fetchBoard()]);
            Alert.toast("Conector removido!", "success", isDarkRef.current);
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao remover o conector.", "error", isDarkRef.current);
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchConnectors, fetchBoard]);

    return {
        mode, setMode,
        loading, isSubmitting,
        connectors, cards, prefixes,
        addConnector, removeConnector,
        refetchBoard: fetchBoard,
    };
};
