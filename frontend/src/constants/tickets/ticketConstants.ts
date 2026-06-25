export const TICKET_STATUS_MAP = {
    ABERTO: { label: 'Aguardando Técnico', color: 'orange' },
    EM_ANDAMENTO: { label: 'Em Atendimento', color: 'blue' },
    RESOLVIDO: { label: 'Finalizado', color: 'green' }
} as const;