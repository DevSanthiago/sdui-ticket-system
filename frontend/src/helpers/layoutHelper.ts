export const getGreetingMessage = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
};

export const getFirstName = (fullName?: string): string => {
    if (!fullName) return "Colaborador";
    return fullName.trim().split(" ")[0];
};