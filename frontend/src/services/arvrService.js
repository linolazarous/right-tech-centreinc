import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const generateARVRContent = async (courseId) => {
    const response = await axios.post(`${API_BASE_URL}/arvr/generate`, { courseId });
    return response.data;
};