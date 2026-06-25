import { api } from "./api";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import type { Plant } from "../../types/models.types";

export const plantsService = {
    getAllPlants: () => api.get<Plant[]>(API_ENDPOINTS.PLANTS.GET_ALL)
};