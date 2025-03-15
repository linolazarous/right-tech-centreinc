import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const allocateScholarship = async (studentId, criteria) => {
    const response = await axios.post(`${API_BASE_URL}/scholarships/allocate`, { studentId, criteria });
    return response.data;
};