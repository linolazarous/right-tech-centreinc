import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createVRLesson } from '../services/vrService';
import PageLayout from '../layouts/PageLayout';
import VRLessonForm from '../components/VRLessonForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';

const VRLearningPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  usePageTracking();

  useEffect(() => {
    logger.info('VR lesson creation accessed', {
      userId: currentUser?.id
    });
  }, [currentUser?.id]);

  const handleSubmit = async (formData) => {
    if (!currentUser?.id) return;
    
    setSubmitting(true);
    try {
      const lesson = await createVRLesson({
        ...formData,
        creatorId: currentUser.id
      });
      
      toast.success('VR lesson created successfully!');
      logger.info('VR lesson created', {
        lessonId: lesson.id,
        creatorId: currentUser.id
      });
      navigate('/vr-lessons');
    } catch (error) {
      logger.error('VR lesson creation failed', error);
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout 
      title="Create VR Lesson" 
      protectedRoute
      seoTitle="Create VR Lesson | Right Tech Centre"
      seoDescription="Design immersive virtual reality learning experiences"
    >
      <ErrorBoundary>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {submitting && <LoadingSpinner overlay />}
          <VRLessonForm 
            onSubmit={handleSubmit}
            disabled={submitting}
            className="bg-white rounded-lg shadow-lg p-6"
          />
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(VRLearningPage);
