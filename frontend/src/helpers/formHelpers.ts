import type { FormFieldSchema, DynamicAnswersRecord, DynamicFieldValue } from '../types';

export const matchesDependency = (answer: DynamicFieldValue, value: string | string[]): boolean =>
    Array.isArray(value) ? value.includes(answer as string) : answer === value;

export const getFieldAnswerKeys = (field: FormFieldSchema): string[] =>
    field.type === 'line_stop' ? [`${field.id}_status`, `${field.id}_time`] : [field.id];

export const areDynamicFieldPropsEqual = <
    P extends { field: FormFieldSchema; answers: DynamicAnswersRecord; onChange: unknown }
>(prev: P, next: P): boolean => {
    if (prev.field !== next.field || prev.onChange !== next.onChange) return false;
    return getFieldAnswerKeys(next.field).every(key => prev.answers[key] === next.answers[key]);
};

export const computeProgressiveFields = (
    fields: FormFieldSchema[],
    answers: DynamicAnswersRecord,
    isProgressive: boolean = false
) => {
    const visibleFields: FormFieldSchema[] = [];
    let isComplete = true;

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        if (field.dependsOn && !matchesDependency(answers[field.dependsOn.field], field.dependsOn.value)) {
            continue;
        }

        visibleFields.push(field);

        if (isProgressive) {
            let isAnswered = false;
            if (field.type === 'line_stop') {
                isAnswered = answers[`${field.id}_status`] !== undefined && answers[`${field.id}_status`] !== null;
            } else {
                const val = answers[field.id];
                isAnswered = val !== undefined && val !== null && String(val).trim() !== '';
            }
            if (field.required && !isAnswered) {
                isComplete = false;
                break;
            }
        }
    }

    if (fields.length === 0) isComplete = false;
    return { visibleFields, isComplete };
};