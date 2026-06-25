export const formatDate = (dateString?: string): string => {
    if (!dateString) return '--/--/-- --:--';
    try {
        return new Date(dateString).toLocaleString('pt-BR');
    } catch {
        return '--/--/-- --:--';
    }
};