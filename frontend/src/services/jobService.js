import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getJobRecommendations = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/jobs/recommendations/${userId}`);
    return response.data;
};