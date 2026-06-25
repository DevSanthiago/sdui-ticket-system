import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../services/api/api";
import { plantConnectorsService } from "../../services/api/plantConnectorsService";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import { Alert } from "../../services/alerts/alertService";
import { TICKET_CREATED_EVENT } from "../notifications/useTicketNotifications";
import { ConnectorSource, ConnectorPanel } from "../../types";
import type { HeatmapTile, PlantConnector } from "../../types";
import type { ProductionLinesByPrefix } from "../../types/api.types";
import type { PrefixOption } from "./useHeatmapBoard";

export type LineHeatmapMode = "heatmap" | "connectors";

const REFRESH_INTERVAL_MS = 30000;
const TICK_INTERVAL_MS = 1000;

export const useLineHeatmap = (isDarkMode: boolean) => {
    const isDarkRef = useRef(isDarkMode);
    useEffect(() => { isDarkRef.current = isDarkMode; }, [isDarkMode]);

    const [mode, setMode] = useState<LineHeatmapMode>("heatmap");
    const [tiles, setTiles] = useState<HeatmapTile[]>([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(() => Date.now());
    const [connectors, setConnectors] = useState<PlantConnector[]>([]);
    const [prefixes, setPrefixes] = useState<PrefixOption[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTiles = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await plantConnectorsService.getHeatmap();
            setTiles(data);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao carregar o heatmap.", "error", isDarkRef.current);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    const fetchConnectors = useCallback(async () => {
        const { data } = await plantConnectorsService.getAll(ConnectorPanel.Heatmap);
        setConnectors(data);
    }, []);

    const fetchPrefixes = useCallback(async () => {
        const { data } = await api.get<ProductionLinesByPrefix[]>(API_ENDPOINTS.ADMIN_COCKPIT.PRODUCTION_LINES_BY_PREFIX);
        setPrefixes(data.map((group) => ({ value: group.prefix, label: group.prefixLabel })));
    }, []);

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchConnectors(), fetchPrefixes(), fetchTiles(true)]);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao carregar o painel.", "error", isDarkRef.current);
        } finally {
            setLoading(false);
        }
    }, [fetchConnectors, fetchPrefixes, fetchTiles]);

    useEffect(() => { loadAll(); }, [loadAll]);

    useEffect(() => {
        const handler = () => fetchTiles(true);
        window.addEventListener(TICKET_CREATED_EVENT, handler);
        const interval = window.setInterval(() => fetchTiles(true), REFRESH_INTERVAL_MS);
        return () => {
            window.removeEventListener(TICKET_CREATED_EVENT, handler);
            window.clearInterval(interval);
        };
    }, [fetchTiles]);

    useEffect(() => {
        const tick = window.setInterval(() => setNow(Date.now()), TICK_INTERVAL_MS);
        return () => window.clearInterval(tick);
    }, []);

    const addConnector = useCallback(async (prefix: string | null) => {
        setIsSubmitting(true);
        try {
            await plantConnectorsService.create({ source: ConnectorSource.ProductionLines, prefix, panel: ConnectorPanel.Heatmap });
            await Promise.all([fetchConnectors(), fetchTiles(true)]);
            Alert.toast("Conector adicionado!", "success", isDarkRef.current);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao adicionar o conector.", "error", isDarkRef.current);
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchConnectors, fetchTiles]);

    const removeConnector = useCallback(async (id: number) => {
        setIsSubmitting(true);
        try {
            await plantConnectorsService.remove(id);
            await Promise.all([fetchConnectors(), fetchTiles(true)]);
            Alert.toast("Conector removido!", "success", isDarkRef.current);
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            Alert.toast(message || "Falha ao remover o conector.", "error", isDarkRef.current);
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchConnectors, fetchTiles]);

    return {
        mode, setMode,
        tiles, loading, now,
        connectors, prefixes, isSubmitting,
        addConnector, removeConnector,
    };
};
