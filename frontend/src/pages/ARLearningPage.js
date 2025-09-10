import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createARLesson } from '../services/arService';
import PageLayout from '../layouts/PageLayout';
import ARLessonForm from '../components/ARLessonForm';
import useNavigate from 'react-router-dom';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import usePageTracking from '../hooks/usePageTracking';

const ARLearningPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  usePageTracking();

  const handleSubmit = async (formData) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const lesson = await createARLesson({
        ...formData,
        creatorId: currentUser.id
      });
      
      toast.success('AR lesson created successfully!');
      logger.info('AR Lesson Created', {
        lessonId: lesson.id,
        creatorId: currentUser.id
      });
      navigate(`/ar-lessons/${lesson.id}`);
    } catch (error) {
      logger.error('AR Lesson Creation Failed', error);
      toast.error(error.response?.data?.message || 'Failed to create lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout 
      title="Create AR Lesson" 
      protectedRoute
      seoTitle="Create AR Lesson | Right Tech Centre"
      seoDescription="Build immersive augmented reality learning experiences"
    >
      <ErrorBoundary>
        {isSubmitting && <LoadingSpinner overlay />}
        <ARLessonForm onSubmit={handleSubmit} disabled={isSubmitting} />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ARLearningPage);


