import { useMinimalTheme } from '../theme/useMinimalTheme';
import { useColorModeValue } from '../theme/useColorModeValue';
import { TICKET_STATUS_MAP } from '../../constants/tickets/ticketConstants';
import type { MockTicketStatus } from '../../types';

export const useTicketTable = () => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const getStatusConfig = (status: string) => {
        return TICKET_STATUS_MAP[status as MockTicketStatus] || {
            label: status,
            color: 'gray'
        };
    };

    return {
        theme,
        isDarkMode,
        getStatusConfig
    };
};