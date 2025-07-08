import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';
import { GA_TRACKING_ID, isProduction } from '../utils/constants';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (isProduction && GA_TRACKING_ID) {
      // Google Analytics
      window.gtag?.('config', GA_TRACKING_ID, {
        page_path: location.pathname + location.search,
      });
      
      // Segment.io (example)
      window.analytics?.page();
    }

    // Custom logging
    logger.info('PageView', {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    });

    // Hotjar (example)
    if (window.hj) {
      window.hj('stateChange', location.pathname);
    }
  }, [location]);

  // Return page view count if needed
  return null;
};

export default usePageTracking;
