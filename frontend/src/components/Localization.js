import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas } from 'react-icons/fa';

const Localization = ({ className }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && savedLang !== language) {
      i18n.changeLanguage(savedLang);
      setLanguage(savedLang);
    }
  }, [i18n, language]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem('userLanguage', newLanguage);
  };

  const languages = [
    { code: 'en', name: 'English', flag: 'ðŸ‡¬ðŸ‡§' },
    { code: 'fr', name: 'FranÃ§ais', flag: 'ðŸ‡«ðŸ‡·' },
    { code: 'es', name: 'EspaÃ±ol', flag: 'ðŸ‡ªðŸ‡¸' },
    { code: 'de', name: 'Deutsch', flag: 'ðŸ‡©ðŸ‡ª' },
    { code: 'zh', name: 'ä¸­æ–‡', flag: 'ðŸ‡¨ðŸ‡³' }
  ];

  return (
    <div className={`localization-selector ${className}`}>
      <FaGlobeAmericas className="language-icon" />
      <select
        value={language}
        onChange={handleLanguageChange}
        aria-label="Select language"
        className="language-dropdown"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

Localization.propTypes = {
  className: PropTypes.string
};

Localization.defaultProps = {
  className: ''
};

export default Localization;
