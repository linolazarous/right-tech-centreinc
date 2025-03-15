import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const downloadCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/offline/download/${courseId}`);
    return response.data;
};