import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LocalizationManager = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [autoTranslate, setAutoTranslate] = useState(false);

  // Top 10 most spoken languages matching your config.js
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', direction: 'ltr' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl' }
  ];

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Save preference to localStorage
      localStorage.setItem('preferredLanguage', languageCode);
      
      // Show success feedback
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleAutoTranslateToggle = (checked) => {
    setAutoTranslate(checked);
    // Here you would typically integrate with a translation API
    console.log('Auto-translate:', checked ? 'enabled' : 'disabled');
  };

  const getCurrentLanguageInfo = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const openTranslationEditor = () => {
    // This would open a modal or redirect to a translation management interface
    console.log('Opening translation editor for:', currentLanguage);
    // Implement your translation editing logic here
  };

  const exportTranslations = () => {
    // Export current language translations
    const translations = i18n.getResourceBundle(currentLanguage, 'translation');
    const dataStr = JSON.stringify(translations, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `translations-${currentLanguage}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTranslations = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const translations = JSON.parse(e.target.result);
          // Here you would typically send these to your backend
          // or update the i18n resources
          console.log('Imported translations:', translations);
          alert(`Translations imported for ${currentLanguage}`);
        } catch (error) {
          console.error('Failed to parse translation file:', error);
          alert('Invalid translation file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const currentLang = getCurrentLanguageInfo();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Language Settings
      </h3>
      
      <div className="space-y-6">
        {/* Current Language Display */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Language
          </h4>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentLang.flag}</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {currentLang.name} ({currentLang.nativeName})
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentLang.direction.toUpperCase()} layout
              </p>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Change Language
          </label>
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} - {lang.nativeName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Changes will apply immediately
          </p>
        </div>

        {/* Translation Management */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Translation Management - {currentLang.name}
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Manage translations for {currentLang.name} language
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openTranslationEditor}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                Edit Translations
              </button>
              <button
                onClick={exportTranslations}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                Export Translations
              </button>
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors cursor-pointer">
                Import Translations
                <input
                  type="file"
                  accept=".json"
                  onChange={importTranslations}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Auto-translate Setting */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <input
            type="checkbox"
            id="auto-translate"
            checked={autoTranslate}
            onChange={(e) => handleAutoTranslateToggle(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="auto-translate" className="text-sm text-gray-700 dark:text-gray-300">
            Auto-translate new content using AI
          </label>
        </div>

        {/* RTL Warning for Arabic and Urdu */}
        {['ar', 'ur'].includes(currentLanguage) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Right-to-Left Layout
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {currentLang.name} uses right-to-left text direction. The interface has automatically adjusted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Translation Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total languages:</span>
              <span className="ml-2 font-medium">{languages.length}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Current language:</span>
              <span className="ml-2 font-medium">{currentLang.name}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Text direction:</span>
              <span className="ml-2 font-medium">{currentLang.direction.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Auto-translate:</span>
              <span className="ml-2 font-medium">{autoTranslate ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalizationManager;
