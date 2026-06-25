import { api } from "./api";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import type { PlantConnector, CreatePlantConnectorPayload, ConnectorBoardCard, HeatmapTile, ConnectorPanel } from "../../types";

export const plantConnectorsService = {
    getAll: (panel?: ConnectorPanel) =>
        api.get<PlantConnector[]>(
            panel ? `${API_ENDPOINTS.PLANT_CONNECTORS.BASE}?panel=${panel}` : API_ENDPOINTS.PLANT_CONNECTORS.BASE
        ),
    create: (payload: CreatePlantConnectorPayload) =>
        api.post(API_ENDPOINTS.PLANT_CONNECTORS.BASE, payload),
    remove: (id: number) => api.delete(API_ENDPOINTS.PLANT_CONNECTORS.DELETE(id)),
    getBoard: () => api.get<ConnectorBoardCard[]>(API_ENDPOINTS.PLANT_CONNECTORS.BOARD),
    getHeatmap: () => api.get<HeatmapTile[]>(API_ENDPOINTS.PLANT_CONNECTORS.HEATMAP),
};
