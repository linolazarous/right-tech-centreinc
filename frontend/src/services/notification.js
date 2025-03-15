export const sendNotification = async (userId, message) => {
    const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message }),
    });
    return response.json();
};