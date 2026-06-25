export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');
};

export const getIconDisplayName = (exportName: string): string => {
    return exportName.replace('Animated', '').replace(/([A-Z])/g, ' $1').trim();
};