export const STATUS_OPTIONS = [
    { value: '', label: 'Qualquer' },
    { value: 'ABERTO', label: 'Aguardando' },
    { value: 'EM_ANDAMENTO', label: 'Em curso' },
    { value: 'RESOLVIDO', label: 'Concluídos' },
    { value: 'TODOS', label: 'Histórico Completo' }
] as const;

export const ALLOWED_FILTER_TYPES = ['card_radio', 'select', 'dynamic_location', 'line_stop'] as const;