import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { logger } from '../utils/logger';
import { MAINTENANCE_MODE } from '../utils/constants';
import MaintenancePage from '../pages/MaintenancePage';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import BackToTop from '../components/BackToTop';
import CustomErrorPage from '../pages/CustomErrorPage';

const PageLayout = ({ 
  children, 
  title, 
  protectedRoute = false,
  className = '',
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImage,
  fullWidth = false,
  noFooter = false,
  noNavbar = false,
  noPadding = false,
  customHeader,
  loading: propLoading = false,
  error = null,
  breadcrumbs = true,
  sidebarLeft,
  sidebarRight,
  themeOverride
}) => {
  const location = useLocation();
  const { currentUser, loading: authLoading, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Track page views
  usePageTracking();

  // Combine auth loading with prop loading
  const isLoading = useMemo(() => authLoading || propLoading, [authLoading, propLoading]);
  
  // Handle theme override
  useEffect(() => {
    if (themeOverride && themeOverride !== theme) {
      setTheme(themeOverride);
    }
  }, [themeOverride, theme, setTheme]);

  // Scroll and visibility effects
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Log page view
    logger.info(`PageView: ${location.pathname}`, {
      path: location.pathname,
      search: location.search,
      protected: protectedRoute,
      authenticated: isAuthenticated
    });

    // Back to top visibility handler
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location, protectedRoute, isAuthenticated]);

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <CustomErrorPage error={error} />;
  }

  if (protectedRoute && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Calculate layout classes
  const layoutClasses = [
    'min-h-screen',
    'flex',
    'flex-col',
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
    noNavbar ? '' : 'pt-16'
  ].join(' ');

  const mainClasses = [
    'flex-grow',
    fullWidth ? '' : 'container mx-auto',
    noPadding ? '' : 'px-4 py-8',
    className
  ].join(' ');

  return (
    <div className={layoutClasses}>
      <Seo 
        title={seoTitle || title}
        description={seoDescription}
        keywords={seoKeywords}
        image={seoImage}
      />
      
      {!noNavbar && <Navbar />}
      
      <div className="flex flex-1">
        {sidebarLeft && (
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            {sidebarLeft}
          </aside>
        )}
        
        <main className={mainClasses}>
          <ErrorBoundary>
            {breadcrumbs && <Breadcrumbs />}
            
            {customHeader ? (
              customHeader
            ) : title ? (
              <h1 className="text-3xl font-bold mb-6" data-testid="page-title">
                {title}
              </h1>
            ) : null}
            
            {children}
          </ErrorBoundary>
        </main>
        
        {sidebarRight && (
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            {sidebarRight}
          </aside>
        )}
      </div>
      
      {!noFooter && <Footer />}
      
      <BackToTop visible={showBackToTop} />
    </div>
  );
};

PageLayout.propTypes = {
  title: PropTypes.string,
  seoTitle: PropTypes.string,
  seoDescription: PropTypes.string,
  seoKeywords: PropTypes.string,
  seoImage: PropTypes.string,
  protectedRoute: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  noFooter: PropTypes.bool,
  noNavbar: PropTypes.bool,
  noPadding: PropTypes.bool,
  customHeader: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  breadcrumbs: PropTypes.bool,
  sidebarLeft: PropTypes.node,
  sidebarRight: PropTypes.node,
  themeOverride: PropTypes.oneOf(['light', 'dark', 'system']),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

PageLayout.defaultProps = {
  protectedRoute: false,
  className: '',
  fullWidth: false,
  noFooter: false,
  noNavbar: false,
  noPadding: false,
  breadcrumbs: true
};

export default React.memo(PageLayout);
