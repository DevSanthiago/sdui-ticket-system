import { STORAGE_KEYS } from '../../constants/storage/storageKeys';
import { TicketStatus, type DynamicAnswersRecord, type User } from '../../types/models.types';
import type { Department } from '../../types';
import type { FormattedBoardTicket, DynamicField } from '../../types';

export const buildTicketReceiptPayload = (
    ticketId: string | number,
    departmentId: number,
    lineName: string,
    isLineStopped: boolean,
    answers: DynamicAnswersRecord,
    department: Department
): FormattedBoardTicket => {
    const now = new Date();

    const mappedFields: DynamicField[] = [];
    
    department.formSchema.fields.forEach(field => {
        let val = answers[field.id];
        
        if (val !== undefined && val !== null && val !== "") {
            
            if (field.id === 'informacoes_linha' || field.type === 'line') {
                val = lineName;
            } 
            else if (field.options && Array.isArray(field.options)) {
                const opt = field.options.find(o => String(o.value) === String(val));
                if (opt) val = opt.label;
            }

            if (typeof val === 'boolean') val = val ? "Sim" : "Não";

            mappedFields.push({
                id: field.id,
                label: field.label,
                value: String(val),
                rawValue: answers[field.id]
            });
        }
    });

    const storedUserStr = localStorage.getItem(STORAGE_KEYS.USER);
    let dynamicUserName = "Usuário não identificado";

    if (storedUserStr) {
        try {
            const parsedUser = JSON.parse(storedUserStr) as User;
            dynamicUserName = parsedUser?.name || "Usuário não identificado";
        } catch (e) {
            console.error("Falha ao ler usuário do localStorage", e);
        }
    }

    return {
        id: ticketId.toString() || "000",
        departmentId: departmentId,
        departmentName: department.name || "Suporte",
        departmentColor: department.cardColorHex || "#3182CE",
        lineName: lineName,
        openedBy: dynamicUserName,
        openedAt: now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        isLineStopped: isLineStopped,
        status: TicketStatus.Open,
        dynamicFields: mappedFields
    };
};