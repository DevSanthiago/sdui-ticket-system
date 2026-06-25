import React from 'react';
import { VStack, Box } from '@chakra-ui/react';
import { DynamicField } from './DynamicField';
import type { DynamicFormRendererProps } from '../../types';

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
    fields, answers, onAnswerChange
}) => {
    return (
        <>
            <style>{`
                @keyframes slideFadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <VStack spacing={6} align="stretch" w="full">
                {fields.map((field) => (
                    <Box key={field.id} w="full"
                        animation="slideFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards">
                        <DynamicField
                            field={field}
                            answers={answers}
                            onChange={onAnswerChange}
                        />
                    </Box>
                ))}
            </VStack>
        </>
    );
};