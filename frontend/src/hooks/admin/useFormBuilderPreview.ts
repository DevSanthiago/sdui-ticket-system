import { useCallback, useState } from 'react';
import type { DynamicAnswersRecord, DynamicFieldValue } from '../../types';

export const useFormBuilderPreview = () => {
    const [previewAnswers, setPreviewAnswers] = useState<DynamicAnswersRecord>({});

    const handlePreviewAnswerChange = useCallback((fieldId: string, value: DynamicFieldValue) => {
        setPreviewAnswers(prev => ({ ...prev, [fieldId]: value }));
    }, []);

    return { previewAnswers, handlePreviewAnswerChange };
};