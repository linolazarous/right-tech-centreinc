import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files for all 10 top languages
import enTranslations from './locales/en/translation.json';
import zhTranslations from './locales/zh/translation.json';
import hiTranslations from './locales/hi/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import arTranslations from './locales/ar/translation.json';
import bnTranslations from './locales/bn/translation.json';
import ptTranslations from './locales/pt/translation.json';
import ruTranslations from './locales/ru/translation.json';
import urTranslations from './locales/ur/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      zh: {
        translation: zhTranslations
      },
      hi: {
        translation: hiTranslations
      },
      es: {
        translation: esTranslations
      },
      fr: {
        translation: frTranslations
      },
      ar: {
        translation: arTranslations
      },
      bn: {
        translation: bnTranslations
      },
      pt: {
        translation: ptTranslations
      },
      ru: {
        translation: ruTranslations
      },
      ur: {
        translation: urTranslations
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0
    },
    react: {
      useSuspense: false
    },
    // Better language detection and support for RTL languages
    supportedLngs: ['en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur'],
    // Handle RTL languages automatically
    // nonExplicitSupportedLngs: true,
    // load: 'languageOnly'
  });

// Add RTL (Right-to-Left) support for Arabic and Urdu
i18n.on('languageChanged', (lng) => {
  const direction = ['ar', 'ur'].includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
  
  // Also update the lang attribute for accessibility
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;
