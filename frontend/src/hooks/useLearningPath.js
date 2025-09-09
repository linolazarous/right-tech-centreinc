import { useState, useEffect } from 'react';
import api from '../services/api';

export const useLearningPath = (pathId) => {
  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pathId) {
      fetchLearningPath();
    }
  }, [pathId]);

  const fetchLearningPath = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/learning-paths/${pathId}`);
      setPath(response.data);
      calculateProgress(response.data.modules);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (modules) => {
    const completed = modules.filter(module => module.status === 'completed').length;
    const total = modules.length;
    setProgress(Math.round((completed / total) * 100));
  };

  const markModuleComplete = async (moduleId) => {
    try {
      await api.post(`/learning-paths/${pathId}/modules/${moduleId}/complete`);
      setPath(prev => ({
        ...prev,
        modules: prev.modules.map(module =>
          module.id === moduleId ? { ...module, status: 'completed' } : module
        )
      }));
      calculateProgress(path.modules);
    } catch (err) {
      throw err;
    }
  };

  const updateModuleProgress = async (moduleId, progressData) => {
    try {
      await api.put(`/learning-paths/${pathId}/modules/${moduleId}/progress`, progressData);
      setPath(prev => ({
        ...prev,
        modules: prev.modules.map(module =>
          module.id === moduleId ? { ...module, progress: progressData.progress } : module
        )
      }));
    } catch (err) {
      throw err;
    }
  };

  return {
    path,
    progress,
    loading,
    error,
    markModuleComplete,
    updateModuleProgress,
    refetch: fetchLearningPath
  };
};
