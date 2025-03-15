import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createPost = async (postData) => {
    const response = await axios.post(`${API_BASE_URL}/forum/posts`, postData);
    return response.data;
};

export const getPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/forum/posts`);
    return response.data;
};