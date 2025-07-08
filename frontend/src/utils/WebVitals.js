/**
 * Web Vitals reporting for performance monitoring
 */

import { trackPerformance } from './monitoring';
import logger from './logger';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      try {
        // Cumulative Layout Shift
        getCLS((metric) => {
          onPerfEntry(metric);
          trackPerformance(metric);
        });

        // First Input Delay
        getFID((metric) => {
          onPerfEntry(metric);
          trackPerformance(metric);
        });

        // First Contentful Paint
        getFCP((metric) => {
          onPerfEntry(metric);
          trackPerformance(metric);
        });

        // Largest Contentful Paint
        getLCP((metric) => {
          onPerfEntry(metric);
          trackPerformance(metric);
        });

        // Time to First Byte
        getTTFB((metric) => {
          onPerfEntry(metric);
          trackPerformance(metric);
        });
      } catch (error) {
        logger.error('Failed to load web vitals', error);
      }
    }).catch((error) => {
      logger.error('Failed to import web-vitals', error);
    });
  }
};

export const getWebVitals = async () => {
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    return {
      CLS: await getCLS({ immediate: true }),
      FID: await getFID({ immediate: true }),
      FCP: await getFCP({ immediate: true }),
      LCP: await getLCP({ immediate: true }),
      TTFB: await getTTFB({ immediate: true })
    };
  } catch (error) {
    logger.error('Failed to get web vitals', error);
    return null;
  }
};

export default reportWebVitals;
