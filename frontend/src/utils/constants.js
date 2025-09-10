/**
 * Application-wide constants and configuration
 * 
 * Note: All sensitive keys should be injected via environment variables
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.righttechcentre.com/v1';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 15000;

// Payment Gateway
export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
export const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

// Analytics and Monitoring
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
export const HOTJAR_ID = process.env.REACT_APP_HOTJAR_ID;
export const SEGMENT_KEY = process.env.REACT_APP_SEGMENT_KEY;
export const SENTRY_ENABLED = process.env.REACT_APP_SENTRY_DSN !== undefined;

// Feature Flags
export const ENABLE_OFFLINE_MODE = process.env.REACT_APP_ENABLE_OFFLINE_MODE === 'true';
export const MAINTENANCE_MODE = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

// Application Constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Local Storage Keys
export const AUTH_TOKEN_KEY = 'rtc_auth_token';
export const USER_DATA_KEY = 'rtc_user_data';
export const CART_DATA_KEY = 'rtc_cart_data';

// Environment Detection
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';
