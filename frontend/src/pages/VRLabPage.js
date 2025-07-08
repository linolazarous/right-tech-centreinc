import React, { Suspense, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../layouts/PageLayout';
import VRDeviceChecker from '../components/vr/VRDeviceChecker';
import VRErrorBoundary from '../components/vr/VRErrorBoundary';
import VRLoading from '../components/vr/VRLoading';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';

const VRLabComponent = React.lazy(() => import('../components/vr/VRLabComponent'));

const VRLabPage = () => {
  const { currentUser } = useAuth();
  const [deviceStatus, setDeviceStatus] = useState({
    isSupported: false,
    isMobile: false,
    requiresCardboard: false
  });
  usePageTracking();

  useEffect(() => {
    logger.info('VR Lab accessed', {
      userId: currentUser?.id,
      deviceStatus
    });
  }, [currentUser?.id, deviceStatus]);

  return (
    <PageLayout 
      title="VR Lab" 
      protectedRoute 
      className="bg-black text-white"
      seoTitle="VR Learning Lab | Right Tech Centre"
      seoDescription="Immersive virtual reality learning environment"
    >
      <VRDeviceChecker onCheck={setDeviceStatus} />
      
      {!deviceStatus.isSupported ? (
        <DeviceNotSupported status={deviceStatus} />
      ) : (
        <VRErrorBoundary>
          <Suspense fallback={<VRLoading />}>
            <VRLabComponent 
              userId={currentUser?.id}
              deviceStatus={deviceStatus}
            />
          </Suspense>
        </VRErrorBoundary>
      )}
    </PageLayout>
  );
};

const DeviceNotSupported = ({ status }) => (
  <div className="text-center p-8">
    <h2 className="text-xl font-bold mb-4">
      {status.isMobile ? 'Mobile VR Required' : 'VR Not Supported'}
    </h2>
    {status.isMobile && !status.requiresCardboard && (
      <div className="space-y-4">
        <p>For the best experience, use:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>A VR headset (Oculus, HTC Vive, etc.)</li>
          <li>Google Cardboard with a compatible smartphone</li>
        </ul>
      </div>
    )}
    {!status.isMobile && (
      <p>Your device doesn't support VR features. Try accessing from a compatible mobile device.</p>
    )}
  </div>
);

export default React.memo(VRLabPage);
