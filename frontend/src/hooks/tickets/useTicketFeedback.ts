import { useState, useEffect } from 'react';
import { useMinimalTheme } from '../theme/useMinimalTheme';
import { useColorModeValue } from '../theme/useColorModeValue';

export const useTicketFeedback = (
    isOpen: boolean,
    onClose: () => void,
    ticketId: number | null,
    onSubmitFeedback: (ticketId: number, feedback: string) => Promise<void>
) => {
    const theme = useMinimalTheme();
    const isDarkMode = useColorModeValue(false, true);

    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSendHovered, setIsSendHovered] = useState(false);
    const [isTopIconAnimating, setIsTopIconAnimating] = useState(false);

    const activeColor = isDarkMode ? "white" : "black";

    useEffect(() => {
        if (isOpen) {
            const startTimer = setTimeout(() => setIsTopIconAnimating(true), 10);
            const endTimer = setTimeout(() => setIsTopIconAnimating(false), 1500);

            return () => {
                clearTimeout(startTimer);
                clearTimeout(endTimer);
            };
        } else {
            const resetTimer = setTimeout(() => setIsTopIconAnimating(false), 10);
            return () => clearTimeout(resetTimer);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!ticketId || !feedback.trim()) return;

        setIsSubmitting(true);
        await onSubmitFeedback(ticketId, feedback);
        setIsSubmitting(false);
        setFeedback('');
        onClose();
    };

    const handleSkip = () => {
        setFeedback('');
        onClose();
    };

    return {
        theme,
        isDarkMode,
        feedback,
        setFeedback,
        isSubmitting,
        isSendHovered,
        setIsSendHovered,
        isTopIconAnimating,
        activeColor,
        handleSubmit,
        handleSkip
    };
};