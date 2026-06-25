import { useMinimalTheme } from '../theme/useMinimalTheme';
import { useColorModeValue } from '../theme/useColorModeValue';
import { TICKET_STATUS_MAP } from '../../constants/tickets/ticketConstants';
import type { MockTicketStatus } from '../../types';

export const useTicketCard = (status: string) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const statusConfig = TICKET_STATUS_MAP[status as MockTicketStatus] || {
        label: status,
        color: 'gray'
    };

    return {
        theme,
        isDarkMode,
        statusLabel: statusConfig.label,
        statusColor: statusConfig.color
    };
};