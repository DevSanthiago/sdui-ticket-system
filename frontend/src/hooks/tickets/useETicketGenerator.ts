import { useState, useEffect, type RefObject } from 'react';
import html2canvas from 'html2canvas';
import { Alert } from '../../services/alerts/alertService';
import type { FormattedBoardTicket } from '../../types';
import { ETICKET_RENDER_DELAY_MS } from '../../constants/tickets/ticketSuccessConstants';

interface UseETicketGeneratorProps {
    isOpen: boolean;
    ticketData: FormattedBoardTicket | null;
    printRef: RefObject<HTMLDivElement | null>;
    isDarkMode: boolean;
    onClose: () => void;
}

export const useETicketGenerator = ({
    isOpen,
    ticketData,
    printRef,
    isDarkMode,
    onClose
}: UseETicketGeneratorProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);
    const [isCopying, setIsCopying] = useState(false);

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

    const copyImageToClipboard = async () => {
        if (!imagePreview) return;
        setIsCopying(true);

        try {
            const response = await fetch(imagePreview);
            const blob = await response.blob();

            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            Alert.toast("E-Ticket copiado! Cole com Ctrl+V no WhatsApp.", "success", isDarkMode);
            onClose();
        } catch (err) {
            console.error('Falha ao copiar E-Ticket:', err);
            Alert.error('Erro', 'Não foi possível copiar a imagem automaticamente.');
        } finally {
            setIsCopying(false);
        }
    };

    return {
        imagePreview,
        isGenerating,
        isCopying,
        copyImageToClipboard
    };
};