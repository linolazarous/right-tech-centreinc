import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createTraining = async (trainingData) => {
    const response = await axios.post(`${API_BASE_URL}/corporate/training`, trainingData);
    return response.data;
};