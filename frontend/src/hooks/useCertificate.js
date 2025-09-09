import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCertificate = (courseId) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCertificate();
    }
  }, [courseId]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/certificates/${courseId}`);
      setCertificate(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/certificates/${courseId}/generate`);
      setCertificate(response.data);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await api.get(`/certificates/${courseId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      throw err;
    }
  };

  const shareCertificate = async (platform) => {
    try {
      // Implement sharing logic based on platform
      console.log('Sharing certificate on:', platform);
    } catch (err) {
      throw err;
    }
  };

  return {
    certificate,
    loading,
    error,
    generateCertificate,
    downloadCertificate,
    shareCertificate,
    refetch: fetchCertificate
  };
};
