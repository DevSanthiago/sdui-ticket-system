export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    KIOSK: '/Auth/kiosk',
  },
  PLANTS: {
    GET_ALL: '/plants',
  },
  TICKETS: {
    BASE: '/tickets',
    CREATE: '/tickets',
    GET_ALL: '/tickets',
    START: (id: number) => `/tickets/${id}/start`,
    RESOLVE: (id: number) => `/tickets/${id}/resolve`,
    FEEDBACK: (id: number) => `/tickets/${id}/feedback`,
  },
  TICKETS_HISTORY: {
    GET_ALL: '/tickets-history',
  },
  CHECKLISTS: {
    INBOX: '/checklists/inbox',
    SUBMIT: '/checklists/submit',
    PENDING_STATUS: '/checklists/pending-status',
    DOWNLOAD_PDF: (id: number) => `/checklists/${id}/pdf`,
  },
  ADMIN_COCKPIT: {
    GET_ALL_PRODUCTION_LINES: '/production-lines',
    PRODUCTION_LINES_BY_PREFIX: '/production-lines/by-prefix',
    CREATE_PRODUCTION_LINE: '/production-lines',
    UPDATE_PRODUCTION_LINE: (id: number) => `/production-lines/${id}`,
    DELETE_PRODUCTION_LINE: (id: number) => `/production-lines/${id}`,
    DEACTIVATE_PRODUCTION_LINE: (id: number) => `/production-lines/${id}/deactivate`,
    ACTIVATE_PRODUCTION_LINE: (id: number) => `/production-lines/${id}/activate`,

    GET_PREFIXES: '/prefixes',
    CREATE_PREFIX: '/prefixes',
    DELETE_PREFIX: (id: number) => `/prefixes/${id}`,
  },
  ACTIONS_PANEL: {
    GET_ALL: '/actions-panel',
  },
  DEPARTMENTS: {
    BASE: '/departments',
    PUBLIC: '/departments/public',
    CREATE: '/departments',
    UPDATE: (id: number) => `/departments/${id}`,
    DELETE: (id: number) => `/departments/${id}`,
    TOGGLE_STATUS: (id: number) => `/departments/${id}/toggle-status`,
  },
  CHECKLIST_TEMPLATES: {
    BASE: '/checklist-templates',
    CREATE: '/checklist-templates',
    GET_BY_ID: (id: number) => `/checklist-templates/${id}`,
    UPDATE: (id: number) => `/checklist-templates/${id}`,
    TOGGLE_STATUS: (id: number) => `/checklist-templates/${id}/toggle-status`,
  },
  FIELD_TEMPLATES: {
    BASE: '/field-templates',
    CREATE: '/field-templates',
    GET_BY_ID: (id: number) => `/field-templates/${id}`,
    UPDATE: (id: number) => `/field-templates/${id}`,
    DELETE: (id: number) => `/field-templates/${id}`,
  },
  ROLES: {
    AVAILABLE: '/roles/available',
  },
  ANALYTICS: {
    DOWNTIME_DASHBOARD_LIVE: '/analytics/dashboard/live',
    DOWNTIME_DASHBOARD_HISTORICAL: '/analytics/historical/range',
    DOWNTIME_DASHBOARD_EXPANDED_LIVE: '/analytics/expanded/downtime-live',
    DOWNTIME_DASHBOARD_EXPANDED_HISTORICAL: '/analytics/expanded/downtime-historical',
  },
  PLANT_CONNECTORS: {
    BASE: '/plant-connectors',
    BOARD: '/plant-connectors/board',
    HEATMAP: '/plant-connectors/heatmap',
    DELETE: (id: number) => `/plant-connectors/${id}`,
  },
} as const;