import { useMemo } from 'react';
import { useMinimalTheme } from '../theme/useMinimalTheme';
import { useColorModeValue } from '../theme/useColorModeValue';
import { Alert } from '../../services/alerts/alertService';
import { TICKET_DETAILS_CONSTANTS } from '../../constants/tickets/ticketDetailsConstants';
import { TicketStatus, type DynamicField, type TicketModalData } from '../../types';

export const useTicketDetails = (
    selectedTicket: TicketModalData | null,
    animatingBite: boolean,
    onClose: () => void,
    onOpenFeedback?: (id: number) => void
) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const hasBite = selectedTicket?.status !== TicketStatus.Open || animatingBite;

    const maskCss = useMemo(() => {
        if (!hasBite) return { top: {}, bottom: {} };

        const gradientTop = 'radial-gradient(circle at 0px 100%, transparent 20px, black 21px), radial-gradient(circle at 100% 100%, transparent 20px, black 21px)';
        const gradientBottom = 'radial-gradient(circle at 0px 0px, transparent 20px, black 21px), radial-gradient(circle at 100% 0px, transparent 20px, black 21px)';
        const maskStyles = { maskSize: '51% 100%', maskPosition: 'left, right', maskRepeat: 'no-repeat' };

        return {
            top: { maskImage: gradientTop, WebkitMaskImage: gradientTop, ...maskStyles, WebkitMaskSize: maskStyles.maskSize, WebkitMaskPosition: maskStyles.maskPosition, WebkitMaskRepeat: maskStyles.maskRepeat },
            bottom: { maskImage: gradientBottom, WebkitMaskImage: gradientBottom, ...maskStyles, WebkitMaskSize: maskStyles.maskSize, WebkitMaskPosition: maskStyles.maskPosition, WebkitMaskRepeat: maskStyles.maskRepeat }
        };
    }, [hasBite]);

    const formattedDynamicFields = useMemo(() => {
        const fields: DynamicField[] = selectedTicket?.dynamicFields || [];
        let currentTotalSpans = 0;

        return fields.map((field, idx, arr) => {
            const label = field.label.toLowerCase().trim();
            const isLongText = (TICKET_DETAILS_CONSTANTS.LONG_TEXT_FIELDS as readonly string[]).includes(label);
            const isLastItem = idx === arr.length - 1;

            let nextIsLongText = false;
            if (!isLastItem) {
                const nextLabel = arr[idx + 1].label.toLowerCase().trim();
                nextIsLongText = (TICKET_DETAILS_CONSTANTS.LONG_TEXT_FIELDS as readonly string[]).includes(nextLabel);
            }

            const isLeftColumn = currentTotalSpans % 2 === 0;
            let colSpan = 1;

            if (isLongText || (isLeftColumn && (isLastItem || nextIsLongText))) {
                colSpan = 2;
            }

            currentTotalSpans += colSpan;

            return { ...field, colSpan };
        });
    }, [selectedTicket?.dynamicFields]);

    const handleFeedbackClick = () => {
        if (!selectedTicket?.canAddFeedback) {
            Alert.toast(TICKET_DETAILS_CONSTANTS.FEEDBACK_EXPIRED_MSG, "warning", isDarkMode);
            return;
        }
        if (onOpenFeedback && selectedTicket.id) {
            onOpenFeedback(Number(selectedTicket.id));
            onClose();
        }
    };

    return {
        theme,
        isDarkMode,
        hasBite,
        topMaskCss: maskCss.top,
        bottomMaskCss: maskCss.bottom,
        formattedDynamicFields,
        handleFeedbackClick
    };
};