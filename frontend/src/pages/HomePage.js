import React, { useEffect } from 'react';
import PageLayout from '../layouts/PageLayout';
import { logger } from '../utils/logger';
import { usePageTracking } from '../hooks/usePageTracking';
import HeroSection from '../components/home/HeroSection';
import ProgramsSection from '../components/home/ProgramsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CtaSection from '../components/home/CtaSection';
import ErrorBoundary from '../components/ErrorBoundary';

const HomePage = () => {
  usePageTracking();

  useEffect(() => {
    logger.info('Home page visited');
    
    // Initialize animations
    const initializeAOS = async () => {
      if (typeof window !== 'undefined') {
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          disable: window.innerWidth < 768 // Disable on mobile
        });
      }
    };

    initializeAOS();
  }, []);

  return (
    <PageLayout noFooterMargin noNavbarPadding>
      <ErrorBoundary>
        <HeroSection />
        <ProgramsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </ErrorBoundary>
    </PageLayout>
  );
};

export default React.memo(HomePage);
