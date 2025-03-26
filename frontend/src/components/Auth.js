import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Assuming you have a CSS file for styling

const Auth = ({ onAuthentication }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Memoized toggle function
  const toggleAuthMode = useCallback(() => {
    setIsLogin(prev => !prev);
    setError(''); // Clear errors when toggling
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, { email, password });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        if (onAuthentication) {
          onAuthentication();
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container" aria-live="polite">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>
        
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="8"
              className="auth-input"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-required="true"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="loading-indicator">Processing...</span>
            ) : (
              isLogin ? 'Login' : 'Sign Up'
            )}
          </button>
        </form>

        <p className="auth-toggle" onClick={toggleAuthMode} role="button" tabIndex="0">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

Auth.propTypes = {
  onAuthentication: PropTypes.func
};

export default Auth;
