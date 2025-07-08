import api from './api';

export const createPost = async (postData) => {
  try {
    const response = await api.post('/forum/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw new Error(error.response?.data?.message || 'Failed to create post');
  }
};

export const getPosts = async () => {
  try {
    const response = await api.get('/forum/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error(error.response?.data?.message || 'Failed to load posts');
  }
};
