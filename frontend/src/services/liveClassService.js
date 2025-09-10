import api from './api';

export const fetchLiveClasses = async () => {
  try {
    const response = await api.get('/live-classes');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch live classes:', error);
    throw new Error(error.response?.data?.message || 'Failed to load live classes');
  }
};

export const fetchLiveClassById = async (classId) => {
  try {
    const response = await api.get(`/live-classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to load live class');
  }
};

export const fetchUpcomingLiveClasses = async (limit = 10) => {
  try {
    const response = await api.get(`/live-classes/upcoming?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch upcoming live classes:', error);
    throw new Error(error.response?.data?.message || 'Failed to load upcoming live classes');
  }
};

export const fetchRecordedClasses = async (courseId = null) => {
  try {
    const endpoint = courseId 
      ? `/live-classes/recorded?courseId=${courseId}`
      : '/live-classes/recorded';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recorded classes:', error);
    throw new Error(error.response?.data?.message || 'Failed to load recorded classes');
  }
};

export const joinLiveClass = async (classId) => {
  try {
    const response = await api.post(`/live-classes/${classId}/join`);
    return response.data;
  } catch (error) {
    console.error('Failed to join live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to join live class');
  }
};

export const leaveLiveClass = async (classId) => {
  try {
    const response = await api.post(`/live-classes/${classId}/leave`);
    return response.data;
  } catch (error) {
    console.error('Failed to leave live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to leave live class');
  }
};

export const scheduleLiveClass = async (classData) => {
  try {
    const response = await api.post('/live-classes/schedule', classData);
    return response.data;
  } catch (error) {
    console.error('Failed to schedule live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to schedule live class');
  }
};

export const updateLiveClass = async (classId, updateData) => {
  try {
    const response = await api.put(`/live-classes/${classId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to update live class');
  }
};

export const cancelLiveClass = async (classId) => {
  try {
    const response = await api.delete(`/live-classes/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to cancel live class:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel live class');
  }
};

export const getLiveClassParticipants = async (classId) => {
  try {
    const response = await api.get(`/live-classes/${classId}/participants`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch participants:', error);
    throw new Error(error.response?.data?.message || 'Failed to load participants');
  }
};

export const sendLiveClassMessage = async (classId, message) => {
  try {
    const response = await api.post(`/live-classes/${classId}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

export const getLiveClassChat = async (classId, limit = 50) => {
  try {
    const response = await api.get(`/live-classes/${classId}/chat?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    throw new Error(error.response?.data?.message || 'Failed to load chat messages');
  }
};

export const raiseHand = async (classId) => {
  try {
    const response = await api.post(`/live-classes/${classId}/raise-hand`);
    return response.data;
  } catch (error) {
    console.error('Failed to raise hand:', error);
    throw new Error(error.response?.data?.message || 'Failed to raise hand');
  }
};

export const lowerHand = async (classId) => {
  try {
    const response = await api.post(`/live-classes/${classId}/lower-hand`);
    return response.data;
  } catch (error) {
    console.error('Failed to lower hand:', error);
    throw new Error(error.response?.data?.message || 'Failed to lower hand');
  }
};

export const getLiveClassStats = async (classId) => {
  try {
    const response = await api.get(`/live-classes/${classId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch class stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to load class statistics');
  }
};

// WebRTC related functions
export const getWebRTCToken = async (classId) => {
  try {
    const response = await api.get(`/live-classes/${classId}/webrtc-token`);
    return response.data;
  } catch (error) {
    console.error('Failed to get WebRTC token:', error);
    throw new Error(error.response?.data?.message || 'Failed to get WebRTC token');
  }
};

export const toggleCamera = async (classId, enabled) => {
  try {
    const response = await api.post(`/live-classes/${classId}/camera`, { enabled });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle camera:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle camera');
  }
};

export const toggleMicrophone = async (classId, enabled) => {
  try {
    const response = await api.post(`/live-classes/${classId}/microphone`, { enabled });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle microphone:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle microphone');
  }
};

export default {
  fetchLiveClasses,
  fetchLiveClassById,
  fetchUpcomingLiveClasses,
  fetchRecordedClasses,
  joinLiveClass,
  leaveLiveClass,
  scheduleLiveClass,
  updateLiveClass,
  cancelLiveClass,
  getLiveClassParticipants,
  sendLiveClassMessage,
  getLiveClassChat,
  raiseHand,
  lowerHand,
  getLiveClassStats,
  getWebRTCToken,
  toggleCamera,
  toggleMicrophone
};
