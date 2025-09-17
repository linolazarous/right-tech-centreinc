import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { logError } from '../utils/monitoring';
import './Auth.css';

// Get the backend URL from the environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Auth = ({ onAuthentication }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthState } = useAuth();

  useEffect(() => {
    if (location.state?.from) {
      setError(`Please login to access ${location.state.from}`);
    }
  }, [location.state]);

  const toggleAuthMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setError('');
    setSuccessMessage('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the full backend URL for the endpoint
      const endpoint = isLogin 
        ? `${BACKEND_URL}/api/auth/login` 
        : `${BACKEND_URL}/api/auth/register`;
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(endpoint, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('authToken', token);
        
        setAuthState({
          isAuthenticated: true,
          user,
          token
        });

        onAuthentication?.();

        if (!isLogin) {
          setSuccessMessage('Registration successful! Redirecting...');
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        navigate(location.state?.from || '/dashboard', { replace: true });
      }
    } catch (err) {
      let errorMessage = 'Authentication failed';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error - please try again';
      }

      setError(errorMessage);
      logError(err, { formData, isLogin });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
        
        {error && (
          <div className="auth-error" role="alert">
            <i className="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="auth-success" role="status">
            <i className="fas fa-check-circle mr-2" aria-hidden="true"></i>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="name"
                aria-required="true"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="auth-input"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-required="true"
            />
            {!isLogin && (
              <small className="form-hint">
                Minimum 8 characters
              </small>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i>
                Processing...
              </>
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-toggle" onClick={toggleAuthMode} role="button" tabIndex="0">
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </p>
          
          {isLogin && (
            <a href="/forgot-password" className="auth-link">
              Forgot password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

Auth.propTypes = {
  onAuthentication: PropTypes.func
};

export default Auth;
