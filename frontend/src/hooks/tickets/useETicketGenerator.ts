import { useState, useEffect, type RefObject } from 'react';
import html2canvas from 'html2canvas';
import type { FormattedBoardTicket } from '../../types';
import { ETICKET_RENDER_DELAY_MS } from '../../constants/tickets/ticketSuccessConstants';

interface UseETicketGeneratorProps {
    isOpen: boolean;
    ticketData: FormattedBoardTicket | null;
    printRef: RefObject<HTMLDivElement | null>;
    isDarkMode: boolean;
}

export const useETicketGenerator = ({
    isOpen,
    ticketData,
    printRef,
    isDarkMode
}: UseETicketGeneratorProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (isOpen && ticketData && printRef.current) {
            setIsGenerating(true);
            setImagePreview(null);

            const timer = setTimeout(async () => {
                try {
                    const canvas = await html2canvas(printRef.current!, {
                        backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
                        logging: false,
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                    });

                    const dataUrl = canvas.toDataURL('image/png');
                    setImagePreview(dataUrl);
                } catch (error) {
                    console.error("Erro ao gerar E-Ticket:", error);
                } finally {
                    setIsGenerating(false);
                }
            }, ETICKET_RENDER_DELAY_MS);

            return () => clearTimeout(timer);
        }
    }, [isOpen, ticketData, isDarkMode, printRef]);

    return {
        imagePreview,
        isGenerating
    };
};