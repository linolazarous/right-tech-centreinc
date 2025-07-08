import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { submitContentModeration } from '../services/moderationService';
import { toast } from 'react-hot-toast';

const ContentModeration = () => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [moderationResult, setModerationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  usePageTracking();

  const moderateContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to moderate');
      return;
    }

    setLoading(true);
    try {
      const response = await submitContentModeration({
        content,
        moderatorId: currentUser?.id
      });
      setModerationResult(response);
      toast.success('Content moderated successfully');
      logger.info('Content moderated', {
        contentLength: content.length,
        result: response.result
      });
    } catch (error) {
      logger.error('Content moderation failed', error);
      toast.error(error.response?.data?.message || 'Moderation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout 
      title="Content Moderation"
      protectedRoute
      seoTitle="Content Moderation | Right Tech Centre"
      seoDescription="Moderate and review platform content"
    >
      <ErrorBoundary>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>
          
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 min-h-[200px]"
            placeholder="Enter content to moderate"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          
          <button
            onClick={moderateContent}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Processing...' : 'Moderate Content'}
          </button>
          
          {moderationResult && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Moderation Result</h2>
              <div className="space-y-2">
                <p><strong>Status:</strong> {moderationResult.status}</p>
                <p><strong>Flags:</strong> {moderationResult.flags?.join(', ') || 'None'}</p>
                {moderationResult.feedback && (
                  <p><strong>Feedback:</strong> {moderationResult.feedback}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(ContentModeration);
