export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};