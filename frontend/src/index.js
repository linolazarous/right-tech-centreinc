import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import App from './App';
import initSentry from './utils/sentry'; // Import Sentry initialization
import './i18n/config'; // Import i18n configuration
import './assets/styles/global.css';

// Initialize Sentry error tracking and performance monitoring
initSentry();

// IMPORTANT: Replace this with your actual reCAPTCHA v3 Site Key
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_V3_SITE_KEY';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <GoogleReCaptchaProvider 
          reCaptchaKey={RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'head',
            nonce: undefined,
          }}
        >
          <App />
        </GoogleReCaptchaProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);






