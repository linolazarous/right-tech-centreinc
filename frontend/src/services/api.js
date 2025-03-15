import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchCourses = async () => {
    const response = await axios.get(`${API_BASE_URL}/courses`);
    return response.data;
};

export const fetchUserProfile = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
};