export const formatDate = (timestamp: string) => {
    if (!timestamp) return 'Data desconhecida';

    try {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        return 'Data inválida';
    }
};

export const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, " ").replace(/\s+/g, " ").trim();
};