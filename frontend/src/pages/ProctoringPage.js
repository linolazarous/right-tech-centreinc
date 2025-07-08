import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import ProctoringMonitor from '../components/proctoring/ProctoringMonitor';
import ProctoringControls from '../components/proctoring/ProctoringControls';
import useProctoring from '../hooks/useProctoring';
import ErrorBoundary from '../components/ErrorBoundary';
import PermissionsModal from '../components/proctoring/PermissionsModal';

const ProctoringPage = () => {
  const { currentUser } = useAuth();
  const videoRef = useRef(null);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false
  });

  const {
    examData,
    alerts,
    status,
    error,
    beginMonitoring,
    endSession
  } = useProctoring(currentUser.id);

  useEffect(() => {
    // Check permissions on mount
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissions(p => ({ ...p, camera: true }));
      } catch {
        console.warn('Camera access denied');
      }
    };
    checkPermissions();
  }, []);

  if (!permissions.camera) {
    return (
      <PageLayout title="Proctoring Setup">
        <PermissionsModal 
          requiredPermissions={['camera']}
          onGranted={() => setPermissions(p => ({ ...p, camera: true }))}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Exam Proctoring" protectedRoute className="bg-gray-100">
      <ErrorBoundary fallback={<ProctoringErrorScreen />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProctoringMonitor 
              ref={videoRef}
              userId={currentUser.id}
              examData={examData}
              status={status}
            />
          </div>
          <div className="space-y-4">
            <ProctoringControls
              onStart={beginMonitoring}
              onEnd={endSession}
              status={status}
              alerts={alerts}
            />
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">Activity Log</h3>
              <div className="h-64 overflow-y-auto">
                {alerts.map((alert, i) => (
                  <div key={i} className="py-2 border-b">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
};

const ProctoringErrorScreen = () => (
  <div className="text-center p-8 bg-red-50 rounded-lg">
    <h2 className="text-xl font-bold text-red-600 mb-2">Proctoring Error</h2>
    <p>Failed to initialize monitoring. Please refresh or contact support.</p>
  </div>
);

export default ProctoringPage;
