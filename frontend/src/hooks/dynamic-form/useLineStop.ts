import type { DynamicAnswersRecord, DynamicFieldValue } from '../../types';

interface UseLineStopParams {
    fieldId: string;
    answers: DynamicAnswersRecord;
    onChange: (fieldId: string, value: DynamicFieldValue) => void;
}

export const useLineStop = ({ fieldId, answers, onChange }: UseLineStopParams) => {
    const isStopped = answers[`${fieldId}_status`];
    const time = answers[`${fieldId}_time`] || '';

    const handleStopChange = (stopped: boolean) => {
        onChange(`${fieldId}_status`, stopped);
        if (stopped) {
            const spTime = new Date().toLocaleTimeString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                hour: '2-digit',
                minute: '2-digit'
            });
            onChange(`${fieldId}_time`, spTime);
        } else {
            onChange(`${fieldId}_time`, '');
        }
    };

    const titleColor = isStopped === true ? "red.500" : isStopped === false ? "green.500" : undefined;
    const activeColorHex = isStopped === true ? "#E53E3E" : isStopped === false ? "#38A169" : "transparent";
    const hasSelection = isStopped !== undefined && isStopped !== null;

    const animTrue = `drawBorderTrue_${fieldId}`;
    const animFalse = `drawBorderFalse_${fieldId}`;
    const animationName = isStopped === true ? animTrue : animFalse;
    const angleVar = `--angle_${fieldId}`;

    return {
        isStopped, time,
        handleStopChange,
        titleColor, activeColorHex,
        hasSelection, animationName, angleVar,
        animTrue, animFalse,
    };
};