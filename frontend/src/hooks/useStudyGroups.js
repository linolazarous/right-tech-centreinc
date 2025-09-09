import { useState, useEffect } from 'react';
import api from '../services/api';

export const useStudyGroups = (courseId = null) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudyGroups();
  }, [courseId]);

  const fetchStudyGroups = async () => {
    try {
      setLoading(true);
      const endpoint = courseId ? `/study-groups?courseId=${courseId}` : '/study-groups';
      const response = await api.get(endpoint);
      setGroups(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStudyGroup = async (groupData) => {
    try {
      const response = await api.post('/study-groups', groupData);
      setGroups(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const joinStudyGroup = async (groupId) => {
    try {
      const response = await api.post(`/study-groups/${groupId}/join`);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? response.data : group
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const leaveStudyGroup = async (groupId) => {
    try {
      const response = await api.post(`/study-groups/${groupId}/leave`);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? response.data : group
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    refetch: fetchStudyGroups
  };
};
