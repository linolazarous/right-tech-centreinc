import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcher = ({ className }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
    setLanguage(selectedLanguage);
    localStorage.setItem('preferredLanguage', selectedLanguage);
    
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = selectedLanguage;
  };

  // Top 10 most spoken languages in the world (by number of native speakers)
  const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', speakers: '1.45B' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speakers: '1.12B' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speakers: '602M' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speakers: '548M' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speakers: '274M' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speakers: '274M' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', speakers: '272M' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', speakers: '257M' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speakers: '255M' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', speakers: '231M' }
  ];

  // Sort languages alphabetically by English name for better UX
  const sortedLanguages = [...LANGUAGES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`language-switcher ${className}`}>
      <FaGlobe className="language-icon" />
      <select 
        value={language} 
        onChange={changeLanguage}
        aria-label="Select language"
        className="language-select"
      >
        {sortedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
};

LanguageSwitcher.propTypes = {
  className: PropTypes.string
};

LanguageSwitcher.defaultProps = {
  className: ''
};

export default LanguageSwitcher;
