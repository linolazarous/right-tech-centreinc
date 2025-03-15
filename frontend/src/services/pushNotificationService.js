import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const sendNotification = async (userId, message) => {
    const response = await axios.post(`${API_BASE_URL}/notifications/send`, { userId, message });
    return response.data;
};