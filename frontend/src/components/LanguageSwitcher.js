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
  };

  const LANGUAGES = [
    { code: 'en', name: 'English', flag: 'ðŸ‡¬ðŸ‡§' },
    { code: 'es', name: 'EspaÃ±ol', flag: 'ðŸ‡ªðŸ‡¸' },
    { code: 'fr', name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
    { code: 'zh', name: 'ä¸­æ–‡', flag: 'ðŸ‡¨ðŸ‡³' },
    { code: 'de', name: 'Deutsch', flag: 'ðŸ‡©ðŸ‡ª' }
  ];

  return (
    <div className={`language-switcher ${className}`}>
      <FaGlobe className="language-icon" />
      <select 
        value={language} 
        onChange={changeLanguage}
        aria-label="Select language"
        className="language-select"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

LanguageSwitcher.propTypes = {
  className: PropTypes.string
};

export default LanguageSwitcher;
