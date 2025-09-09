import React, { useState } from 'react';

const LocalizationManager = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Language</label>
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Translation Management</label>
          <div className="border border-gray-300 rounded p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage translations for selected language
            </p>
            <button className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm">
              Edit Translations
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="auto-translate"
            className="rounded"
          />
          <label htmlFor="auto-translate" className="text-sm">
            Auto-translate new content
          </label>
        </div>
      </div>
    </div>
  );
};

export default LocalizationManager;
