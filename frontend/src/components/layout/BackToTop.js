import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { throttle } from '../utils/helpers';
import { logger } from '../utils/logger';

const BackToTop = ({ visible, offset = 300, behavior = 'smooth' }) => {
  const [isVisible, setIsVisible] = useState(visible);

  const checkVisibility = throttle(() => {
    setIsVisible(window.pageYOffset > offset);
  }, 200);

  const scrollToTop = () => {
    try {
      window.scrollTo({
        top: 0,
        behavior: behavior,
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
      logger.warn('Smooth scrolling not supported', error);
    }
  };

  useEffect(() => {
    if (visible === undefined) {
      window.addEventListener('scroll', checkVisibility);
      return () => window.removeEventListener('scroll', checkVisibility);
    }
  }, [visible, checkVisibility]);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};

BackToTop.propTypes = {
  visible: PropTypes.bool,
  offset: PropTypes.number,
  behavior: PropTypes.oneOf(['smooth', 'auto']),
};

BackToTop.defaultProps = {
  offset: 300,
  behavior: 'smooth',
};

export default React.memo(BackToTop);
