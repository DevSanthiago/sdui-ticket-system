export const SUMMARY_BUILDER_CONSTANTS = {
    MAX_SELECTION_LIMIT: 3,
    EXCLUDED_FIELD_TYPES: ['dynamic_location', 'line_stop'],
    MOCK: {
        TICKET_ID: '1024',
        DEFAULT_DEPARTMENT_NAME: 'Nome do Departamento',
        DEFAULT_LIGHT_COLOR: '#3182CE',
        DEFAULT_DARK_COLOR: '#4299E1',
        DEFAULT_LINE_NAME: 'LO02/LO2A',
        DEFAULT_OPERATOR: 'Operador de Exemplo',
        DEFAULT_STATUS: 'ABERTO' as const,
        DEFAULT_FIELD_LABEL: 'Campo Desconhecido',
        DEFAULT_FIELD_VALUE: 'Resposta de exemplo do usuário...',
        EMPTY_SUMMARY_LABEL: 'Resumo',
        EMPTY_SUMMARY_VALUE: 'Selecione campos para o resumo...'
    }
};