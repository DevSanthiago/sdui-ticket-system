import { api } from "./api";
import { API_ENDPOINTS } from "../../constants/endpoints/apiEndpoints";
import type { FieldTemplate, CreateFieldTemplatePayload } from "../../types";

export const fieldTemplatesService = {
    getAll: () => api.get<FieldTemplate[]>(API_ENDPOINTS.FIELD_TEMPLATES.BASE),
    create: (payload: CreateFieldTemplatePayload) =>
        api.post<FieldTemplate>(API_ENDPOINTS.FIELD_TEMPLATES.CREATE, payload),
    update: (id: number, payload: CreateFieldTemplatePayload) =>
        api.put<FieldTemplate>(API_ENDPOINTS.FIELD_TEMPLATES.UPDATE(id), payload),
    remove: (id: number) => api.delete(API_ENDPOINTS.FIELD_TEMPLATES.DELETE(id)),
};
