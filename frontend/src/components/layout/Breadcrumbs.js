import React from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { logger } from '../utils/logger';

const Breadcrumbs = ({ customRoutes = [] }) => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  const getRouteName = (path, index) => {
    // Check custom routes first
    const customRoute = customRoutes.find(route => 
      matchPath(route.path, `/${paths.slice(0, index + 1).join('/')}`)
    );
    if (customRoute) return customRoute.name;

    // Default behavior
    return path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  try {
    return (
      <nav className="flex items-center text-sm mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <HomeIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {paths.map((path, index) => {
            const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            const name = getRouteName(path, index);

            return (
              <li key={routeTo}>
                <div className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {isLast ? (
                    <span className="ml-2 font-medium text-gray-700">
                      {name}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      {name}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  } catch (error) {
    logger.error('Breadcrumbs rendering error', error);
    return null; // Fail gracefully
  }
};

Breadcrumbs.propTypes = {
  customRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

Breadcrumbs.defaultProps = {
  customRoutes: [],
};

export default React.memo(Breadcrumbs);
