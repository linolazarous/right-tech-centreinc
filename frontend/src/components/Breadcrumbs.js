import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbMap = {
    'courses': 'Courses',
    'programs': 'Programs',
    'profile': 'Profile',
    'contact': 'Contact',
    'about': 'About',
    'login': 'Login',
    'register': 'Register',
    'dashboard': 'Dashboard',
    'settings': 'Settings',
    'certificates': 'Certificates',
    'forum': 'Forum',
    'live-class': 'Live Classes',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service'
  };

  return (
    <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              to="/"
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <FaHome className="inline-block mr-1 h-4 w-4" />
              Home
            </Link>
          </li>
          
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = breadcrumbMap[value] || value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return (
              <li key={to} className="flex items-center">
                <FaChevronRight className="h-3 w-3 text-gray-400 mx-2" />
                {isLast ? (
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
