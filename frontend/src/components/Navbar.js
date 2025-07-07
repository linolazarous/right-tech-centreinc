import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/courses', label: 'Courses' },
    { path: '/forum', label: 'Forum' },
    { path: '/resources', label: 'Resources' },
    { path: '/about', label: 'About' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Right Tech Centre
          </Link>
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="navbar-utilities">
            <LanguageSwitcher className="navbar-language" />
            
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="user-button">
                  <FaUser /> {user.name}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <Link to="/settings" className="dropdown-item">Settings</Link>
                  <button onClick={onLogout} className="dropdown-item">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-button">
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  onLogout: PropTypes.func.isRequired
};

Navbar.defaultProps = {
  user: null
};

export default Navbar;
