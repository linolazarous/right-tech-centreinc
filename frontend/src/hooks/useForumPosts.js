import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useForumPosts = (courseId = null, topicId = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchPosts = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '/forum/posts';
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (courseId) params.append('courseId', courseId);
      if (topicId) params.append('topicId', topicId);

      const response = await api.get(`${endpoint}?${params}`);
      
      setPosts(response.data.posts);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [courseId, topicId]);

  const createPost = async (postData) => {
    try {
      const response = await api.post('/forum/posts', postData);
      setPosts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const updatePost = async (postId, updateData) => {
    try {
      const response = await api.put(`/forum/posts/${postId}`, updateData);
      setPosts(prev => prev.map(post => 
        post.id === postId ? response.data : post
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/forum/posts/${postId}`);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/like`);
      setPosts(prev => prev.map(post => 
        post.id === postId ? response.data : post
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const unlikePost = async (postId) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/unlike`);
      setPosts(prev => prev.map(post => 
        post.id === postId ? response.data : post
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const addComment = async (postId, commentData) => {
    try {
      const response = await api.post(`/forum/posts/${postId}/comments`, commentData);
      setPosts(prev => prev.map(post => 
        post.id === postId ? response.data : post
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  const searchPosts = async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search: searchTerm, ...filters });
      const response = await api.get(`/forum/posts/search?${params}`);
      setPosts(response.data.posts);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (postId) => {
    try {
      const response = await api.get(`/forum/posts/${postId}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  };

  // Load initial posts
  useEffect(() => {
    fetchPosts(1, pagination.limit);
  }, [fetchPosts, pagination.limit]);

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    searchPosts,
    getPostById,
    refetch: () => fetchPosts(pagination.page, pagination.limit)
  };
};

export default useForumPosts;
