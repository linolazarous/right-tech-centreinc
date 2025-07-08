import React, { Suspense, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import WebGLChecker from '../components/virtual-lab/WebGLChecker';
import LabLoading from '../components/virtual-lab/LabLoading';
import ErrorBoundary from '../components/ErrorBoundary';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';

const VirtualLabView = React.lazy(() => import('../components/virtual-lab/VirtualLabView'));

const VirtualLabPage = () => {
  const { currentUser } = useAuth();
  const [labReady, setLabReady] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  usePageTracking();

  useEffect(() => {
    logger.info('Virtual lab accessed', {
      userId: currentUser?.id,
      webGLAvailable
    });
  }, [currentUser?.id, webGLAvailable]);

  const handleWebGLCheck = (isSupported) => {
    setWebGLAvailable(isSupported);
    if (isSupported) setLabReady(true);
  };

  return (
    <PageLayout 
      title="Virtual Lab" 
      protectedRoute 
      className="bg-gray-900 text-white"
      seoTitle="Virtual Coding Lab | Right Tech Centre"
      seoDescription="Interactive virtual environment for hands-on coding practice"
    >
      <WebGLChecker onCheck={handleWebGLCheck} />
      
      {!webGLAvailable ? (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold mb-4">WebGL Not Supported</h2>
          <p className="mb-4">
            Your browser doesn't support WebGL which is required for the virtual lab.
          </p>
          <div className="space-y-2 text-sm">
            <p>Try using a modern browser like:</p>
            <ul className="list-disc list-inside">
              <li>Google Chrome (latest version)</li>
              <li>Mozilla Firefox (latest version)</li>
              <li>Microsoft Edge (latest version)</li>
            </ul>
          </div>
        </div>
      ) : (
        <ErrorBoundary fallback={<LabErrorScreen />}>
          <Suspense fallback={<LabLoading />}>
            {labReady && (
              <VirtualLabView 
                userId={currentUser?.id}
                onError={() => setLabReady(false)}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      )}
    </PageLayout>
  );
};

const LabErrorScreen = () => (
  <div className="text-center p-8 bg-red-900 rounded-lg">
    <h2 className="text-xl font-bold mb-2">Lab Session Failed</h2>
    <p>Could not load the virtual environment. Please try again later.</p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-200"
    >
      Reload Page
    </button>
  </div>
);

export default React.memo(VirtualLabPage);
