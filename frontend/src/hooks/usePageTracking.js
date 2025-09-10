import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';
import { GA_TRACKING_ID, isProduction, HOTJAR_ID, SEGMENT_KEY, SENTRY_ENABLED } from '../utils/constants';

/**
 * Custom hook for tracking page views and analytics
 * Supports multiple analytics platforms: Google Analytics, Segment.io, Hotjar, and custom logging
 */
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = () => {
      const pagePath = location.pathname + location.search + location.hash;
      
      // Google Analytics
      if (isProduction && GA_TRACKING_ID && typeof window.gtag === 'function') {
        try {
          window.gtag('config', GA_TRACKING_ID, {
            page_path: pagePath,
            page_title: document.title,
          });
        } catch (error) {
          console.warn('Google Analytics tracking failed:', error);
        }
      }

      // Segment.io
      if (isProduction && SEGMENT_KEY && typeof window.analytics?.page === 'function') {
        try {
          window.analytics.page();
        } catch (error) {
          console.warn('Segment.io tracking failed:', error);
        }
      }

      // Hotjar
      if (isProduction && HOTJAR_ID && typeof window.hj === 'function') {
        try {
          window.hj('stateChange', pagePath);
        } catch (error) {
          console.warn('Hotjar tracking failed:', error);
        }
      }

      // Sentry (if configured)
      if (SENTRY_ENABLED && typeof window.Sentry !== 'undefined') {
        try {
          window.Sentry.configureScope((scope) => {
            scope.setTag('page.path', pagePath);
          });
        } catch (error) {
          console.warn('Sentry context setting failed:', error);
        }
      }

      // Custom logging
      try {
        logger.info('PageView', {
          path: location.pathname,
          search: location.search,
          hash: location.hash,
          title: document.title,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Custom logging failed:', error);
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(trackPageView, 100);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Optional: Return tracking functions if needed by components
  const trackEvent = (category, action, label, value) => {
    if (isProduction && GA_TRACKING_ID && typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackConversion = (conversionId, conversionLabel) => {
    if (isProduction && GA_TRACKING_ID && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: `${GA_TRACKING_ID}/${conversionId}${conversionLabel ? `/${conversionLabel}` : ''}`,
      });
    }
  };

  // Return tracking functions if components need to manually trigger events
  return {
    trackEvent,
    trackConversion,
  };
};

// Named export for flexibility
export { usePageTracking };

// Default export for backward compatibility
export default usePageTracking;
